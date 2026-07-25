import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { createInvestmentDto } from '../investment/Dto/create.investment';
@Injectable()
export class FlowableService {
  private readonly flowableUrl: string;
  private readonly username: string;
  private readonly password: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.flowableUrl = this.configService.get<string>('workflow.flowable.url')!;

    this.username = this.configService.get<string>(
      'workflow.flowable.username',
    )!;

    this.password = this.configService.get<string>(
      'workflow.flowable.password',
    )!;
  }

  async startProcess(dto: createInvestmentDto, investorId: string) {
    const url = `${this.flowableUrl}/runtime/process-instances`;

    const body = {
      processDefinitionKey: 'investmentProcess',

      variables: [
        {
          name: 'investorId',
          value: investorId,
          type: 'string',
        },

        {
          name: 'companyName',
          value: dto.companyName,
          type: 'string',
        },

        {
          name: 'investmentAmount',
          value: dto.investmentAmount,
          type: 'long',
        },
        {
          name: 'approvalGroups',
          value: [
            'finance-team',
            'risk-team',
            'legal-team',
            'compliance-team',
            'executive-team',
          ],
          type: 'json',
        },
      ],
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          auth: {
            username: this.username,
            password: this.password,
          },
        }),
      );

      const processInstanceId = response.data.id;

      const tasksResponse = await firstValueFrom(
        this.httpService.get(`${this.flowableUrl}/runtime/tasks`, {
          params: {
            processInstanceId,
          },

          auth: {
            username: this.username,
            password: this.password,
          },
        }),
      );

      return {
        processInstanceId,

        processDefinitionId: response.data.processDefinitionId,

        task: tasksResponse.data.data[0] || null,
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      console.log(
        'FLOWABLE ERROR:',
        axiosError.response?.data || axiosError.message,
      );

      throw error;
    }
  }
  async getTasks() {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.flowableUrl}/runtime/tasks`,
        {
          auth: {
            username: this.username,
            password: this.password,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.log('FLOWABLE ERROR:', error.response?.data || error.message);
      throw error;
    }
  }
  async getProcessInstance(processInstanceId: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.flowableUrl}/runtime/process-instances/${processInstanceId}`,
        {
          auth: {
            username: this.username,
            password: this.password,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          ended: true,
          completed: true,
        };
      }

      throw error;
    }
  }
  async getProcessVariables(processInstanceId: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.flowableUrl}/runtime/process-instances/${processInstanceId}/variables`,
        {
          auth: {
            username: this.username,
            password: this.password,
          },
        },
      );

      return response.data.data;
    } catch (error: any) {
      console.log(
        'FLOWABLE VARIABLES ERROR:',
        error.response?.data || error.message,
      );

      return [];
    }
  }

  async getTask(taskId: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.flowableUrl}/runtime/tasks/${taskId}`,
        {
          auth: {
            username: this.username,
            password: this.password,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.log('FLOWABLE ERROR:', error.response?.data || error.message);
      throw error;
    }
  }

  async getProcessTasks(processInstanceId: string) {
    const response = await this.httpService.axiosRef.get(
      `${this.flowableUrl}/runtime/tasks`,
      {
        params: {
          processInstanceId,
        },
        auth: {
          username: this.username,
          password: this.password,
        },
      },
    );

    return response.data.data;
  }
  async claimTask(taskId: string, userId: string) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.flowableUrl}/runtime/tasks/${taskId}`,
        {
          action: 'claim',
          assignee: userId,
        },
        {
          auth: {
            username: this.username,
            password: this.password,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.log('FLOWABLE ERROR:', error.response?.data || error.message);
      throw error;
    }
  }

  async completeTask(taskId: string, variables?: any[]) {
    try {
      console.log({
        action: 'complete',
        variables,
      });
      const response = await this.httpService.axiosRef.post(
        `${this.flowableUrl}/runtime/tasks/${taskId}`,
        {
          action: 'complete',
          variables,
        },
        {
          auth: {
            username: this.username,
            password: this.password,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.log('FLOWABLE ERROR:', error.response?.data || error.message);
      throw error;
    }
  }
}
