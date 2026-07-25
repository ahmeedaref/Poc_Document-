import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  NationalIdService,
  TaxClearanceService,
} from '@org/external-integration';
import { Cron } from '@nestjs/schedule';
import { RiskEvaluationService } from './risk-evaluation.service';
import { CompanyRegistrationService } from './company-registration.service';
import { NotificationService } from './notification.service';
import { InvestmentWorkflowService } from './investment-workflow.service';
import { RabbitMQService } from '@org/message-broker';
interface FlowableVariable {
  name: string;
  value: string | number | boolean;
  type?: string;
}

@Injectable()
export class WorkflowAutomationService {
  private flowableUrl: string;
  private username: string;
  private password: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly nationalIdService: NationalIdService,
    private readonly taxClearanceService: TaxClearanceService,
    private readonly riskEvaluationService: RiskEvaluationService,
    private readonly companyRegistrationService: CompanyRegistrationService,
    private readonly notificationService: NotificationService,
    private readonly investmentWorkflowService: InvestmentWorkflowService,
    private readonly rabbitMQService: RabbitMQService,
  ) {
    this.flowableUrl = this.configService.get<string>('FLOWABLE_URL') ?? '';

    this.username = this.configService.get<string>('FLOWABLE_USERNAME') ?? '';

    this.password = this.configService.get<string>('FLOWABLE_PASSWORD') ?? '';
  }

  private get auth() {
    return {
      username: this.username,
      password: this.password,
    };
  }

  async getActiveTasks() {
    const response = await axios.get(`${this.flowableUrl}/runtime/tasks`, {
      auth: this.auth,
    });

    return response.data;
  }

  async getTaskVariables(taskId: string): Promise<FlowableVariable[]> {
    const response = await axios.get(
      `${this.flowableUrl}/runtime/tasks/${taskId}/variables`,
      {
        auth: this.auth,
      },
    );

    return Array.isArray(response.data)
      ? response.data
      : (response.data.data ?? []);
  }

  async getProcessVariables(
    processInstanceId: string,
  ): Promise<FlowableVariable[]> {
    const response = await axios.get(
      `${this.flowableUrl}/runtime/process-instances/${processInstanceId}/variables`,
      {
        auth: this.auth,
      },
    );

    console.log('PROCESS VARIABLES RAW:', response.data);

    return Array.isArray(response.data)
      ? response.data
      : (response.data.data ?? []);
  }

  async completeTask(taskId: string, variables: FlowableVariable[]) {
    const response = await axios.post(
      `${this.flowableUrl}/runtime/tasks/${taskId}`,
      {
        action: 'complete',

        variables: variables.map((v) => ({
          name: v.name,
          value: v.value,
          type: v.type ?? 'string',
        })),
      },
      {
        auth: this.auth,
      },
    );

    console.log('Task completed:', taskId, variables);

    return response.data;
  }

  async testConnection() {
    return this.getActiveTasks();
  }

  async handleSystemTasks() {
    const tasks = await this.getActiveTasks();

    const systemTasks = [
      'National ID Verification',
      'Tax Clearance Verification',
      'Risk Evaluation',
      'Company Registration',
      'Notify Investor',
    ];

    for (const task of tasks.data) {
      if (!systemTasks.includes(task.name)) {
        continue;
      }

      try {
        if (task.name === 'National ID Verification') {
          console.log('Handling National ID:', task.id);

          const result = await this.nationalIdService.verify('123456');

          await this.completeTask(task.id, [
            {
              name: 'nationalIdVerified',
              value: result.valid,
              type: 'boolean',
            },
          ]);
        }

        if (task.name === 'Tax Clearance Verification') {
          console.log('Handling Tax:', task.id);

          const result = await this.taxClearanceService.verify('COMP001');

          await this.completeTask(task.id, [
            {
              name: 'taxClearanceVerified',
              value: result.taxClearance,
              type: 'boolean',
            },
          ]);
        }
        if (task.name === 'Risk Evaluation') {
          console.log('Handling Risk:', task.id);

          const variables = await this.getProcessVariables(
            task.processInstanceId,
          );

          console.log('Risk Variables:', variables);

          const amount = Number(
            variables.find((v) => v.name === 'investmentAmount')?.value ?? 0,
          );

          console.log('Investment Amount:', amount);

          const riskLevel = this.riskEvaluationService.evaluate(amount);

          console.log('Risk Decision:', riskLevel);

          await this.completeTask(task.id, [
            {
              name: 'riskLevel',
              value: riskLevel,
              type: 'string',
            },
          ]);
        }

        if (task.name === 'Company Registration') {
          console.log('Handling Company Registration:', task.id);

          const variables = await this.getProcessVariables(
            task.processInstanceId,
          );

          const companyName = String(
            variables.find((v) => v.name === 'companyName')?.value ?? '',
          );

          console.log('Company Name:', companyName);

          const registration =
            await this.companyRegistrationService.register(companyName);

          await this.completeTask(task.id, [
            {
              name: 'companyRegistered',
              value: true,
              type: 'boolean',
            },
            {
              name: 'registrationNumber',
              value: registration.registrationNumber,
              type: 'string',
            },
          ]);
        }

        if (task.name === 'Notify Investor') {
          console.log('Handling Notification:', task.id);

          const variables = await this.getProcessVariables(
            task.processInstanceId,
          );

          const investorId = String(
            variables.find((v) => v.name === 'investorId')?.value ?? '',
          );

          const companyName = String(
            variables.find((v) => v.name === 'companyName')?.value ?? '',
          );

          const approvalStatus = String(
            variables.find((v) => v.name === 'approvalStatus')?.value ??
              'APPROVED',
          ) as 'APPROVED' | 'REJECTED';

          /**
           * Update PostgreSQL
           */
          const investment =
            await this.investmentWorkflowService.completeInvestment(
              task.processInstanceId,
              approvalStatus,
            );

          /**
           * Publish RabbitMQ Event
           */
          if (approvalStatus === 'APPROVED') {
            await this.rabbitMQService.publishInvestmentApproved({
              investmentId: investment.id,
              investorId: investment.investorId,
              companyName: investment.companyName,
              investmentAmount: investment.investmentAmount,
              approvalStatus: 'APPROVED',
              approvedAt: new Date().toISOString(),
            });
          } else {
            await this.rabbitMQService.publishInvestmentRejected({
              investmentId: investment.id,
              investorId: investment.investorId,
              companyName: investment.companyName,
              investmentAmount: investment.investmentAmount,
              approvalStatus: 'REJECTED',
              rejectedAt: new Date().toISOString(),
            });
          }

          /**
           * Send Notification
           */
          await this.notificationService.notify(
            investorId,
            companyName,
            approvalStatus,
          );

          /**
           * Complete Flowable Task
           */
          await this.completeTask(task.id, [
            {
              name: 'notificationSent',
              value: true,
              type: 'boolean',
            },
          ]);
        }
      } catch (error) {
        console.error('System task failed:', task.id, error);
      }
    }
  }

  @Cron('*/10 * * * * *')
  async processSystemTasks() {
    console.log('Checking Flowable system tasks...');

    await this.handleSystemTasks();
  }
}
