import { Injectable, NotFoundException } from '@nestjs/common';

import { FlowableService } from '../flowable/flowable.service';
import { createInvestmentDto } from './Dto/create.investment';
import { InvestmentRepository } from './investment.repository';
import { JwtUser } from '../../../../libs/auth/src/lib/interfaces/jwt-user.interface';
import { RabbitMQService } from '@org/message-broker';

import { CompleteTaskDto } from './Dto/complete-task.dto';
@Injectable()
export class InvestmentService {
  constructor(
    private readonly flowableService: FlowableService,
    private readonly investmentRepository: InvestmentRepository,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async createInvestment(dto: createInvestmentDto, User: JwtUser) {
    const keycloakId = User.id;
    console.log('SEARCH KEYCLOAK ID:', keycloakId);
    const user =
      await this.investmentRepository.findUserByKeycloakId(keycloakId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const investment = await this.investmentRepository.create({
      investorId: user.id,
      companyName: dto.companyName,
      investmentAmount: dto.investmentAmount,
    });

    const process = await this.flowableService.startProcess(dto);

    const updatedInvestment =
      await this.investmentRepository.updateProcessInstance(
        investment.id,
        process.processInstanceId,
      );

    return {
      message: 'Investment workflow started successfully',

      investment: updatedInvestment,

      workflow: {
        processInstanceId: process.processInstanceId,
        task: process.task,
      },
    };
  }
  async findAll() {
    const investments = await this.investmentRepository.findAll();

    return Promise.all(
      investments.map(async (investment) => {
        let workflow = null;

        if (investment.processInstanceId) {
          const process = await this.flowableService.getProcessInstance(
            investment.processInstanceId,
          );

          if (process?.ended) {
            workflow = {
              state: 'COMPLETED',
            };
          } else {
            const tasks = await this.flowableService.getProcessTasks(
              investment.processInstanceId,
            );

            const task = tasks[0];

            if (task) {
              workflow = {
                state: 'RUNNING',
                taskId: task.id,
                taskName: task.name,
              };
            }
          }
        }

        return {
          ...investment,
          workflow,
        };
      }),
    );
  }

  async completeTask(taskId: string, variables: CompleteTaskDto) {
    const task = await this.flowableService.getTask(taskId);

    await this.flowableService.completeTask(taskId, [
      {
        name: 'approvalStatus',
        value: variables.approvalStatus,
        type: 'string',
      },
    ]);

    const approvalStatus = variables.approvalStatus;

    const investment = await this.investmentRepository.findByProcessInstanceId(
      task.processInstanceId,
    );

    if (!investment) {
      throw new Error('Investment not found');
    }

    const newStatus = approvalStatus === 'APPROVED' ? 'APPROVED' : 'REJECTED';

    await this.investmentRepository.updateStatus(investment.id, newStatus);

    if (newStatus === 'APPROVED') {
      await this.rabbitMQService.publishInvestmentApproved({
        investmentId: investment.id,
        investorId: investment.investorId,
        companyName: investment.companyName,
        investmentAmount: investment.investmentAmount,
        approvalStatus: 'APPROVED',
        approvedAt: new Date().toISOString(),
      });
    }

    return {
      investmentId: investment.id,
      approvalStatus,
      investmentStatus: newStatus,
      processState: 'COMPLETED',
    };
  }
}
