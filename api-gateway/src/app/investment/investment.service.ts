import { Injectable, NotFoundException } from '@nestjs/common';

import { FlowableService } from '../flowable/flowable.service';
import { createInvestmentDto } from './Dto/create.investment';
import { InvestmentRepository } from './investment.repository';
import { JwtUser } from '@org/auth';
import { CompleteTaskDto } from './Dto/complete-task.dto';
interface FlowableTask {
  id: string;
  name: string;
  taskDefinitionKey: string;
  processInstanceId: string;
}
@Injectable()
export class InvestmentService {
  constructor(
    private readonly flowableService: FlowableService,
    private readonly investmentRepository: InvestmentRepository,
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

    const process = await this.flowableService.startProcess(dto, user.id);

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

          if (!process) {
            workflow = {
              state: 'NOT_FOUND',
            };
          } else if (process.ended) {
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

  async completeTask(taskId: string, dto: CompleteTaskDto) {
    const task = await this.flowableService.getTask(taskId);

    let flowableVariables: {
      name: string;
      value: string;
      type: string;
    }[] = [];

    if (task.taskDefinitionKey === 'reviewInvestment') {
      if (!dto.approvalStatus) {
        throw new Error('approvalStatus is required for review task');
      }

      flowableVariables = [
        {
          name: 'approvalStatus',
          value: dto.approvalStatus,
          type: 'string',
        },
      ];
    }

    if (task.taskDefinitionKey === 'approvalWorkflow') {
      if (!dto.approvalStatus) {
        throw new Error('approvalStatus is required for approval task');
      }

      flowableVariables = [
        {
          name: 'approvalStatus',
          value: dto.approvalStatus,
          type: 'string',
        },
      ];
    }

    await this.flowableService.completeTask(taskId, flowableVariables);

    if (task.taskDefinitionKey !== 'approvalWorkflow') {
      return {
        message: 'Task completed',
        task: task.name,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const tasks = await this.flowableService.getProcessTasks(
      task.processInstanceId,
    );

    const remainingApprovalTasks = tasks.filter(
      (t: FlowableTask) => t.taskDefinitionKey === 'approvalWorkflow',
    );

    if (remainingApprovalTasks.length > 0) {
      return {
        message: 'Approval recorded. Waiting for remaining approvals.',
        remainingApprovals: remainingApprovalTasks.length,
      };
    }

    const investment = await this.investmentRepository.findByProcessInstanceId(
      task.processInstanceId,
    );

    if (!investment) {
      throw new Error('Investment not found');
    }

    const newStatus =
      dto.approvalStatus === 'APPROVED' ? 'APPROVED' : 'REJECTED';

    await this.investmentRepository.updateStatus(investment.id, newStatus);

    return {
      investmentId: investment.id,
      approvalStatus: newStatus,
      investmentStatus: newStatus,
      processState: 'WAITING_FOR_FINALIZATION',
    };
  }
}
