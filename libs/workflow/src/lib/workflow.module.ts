import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkflowAutomationService } from './workflow-automation.service';
import { ExternalIntegrationModule } from '@org/external-integration';
import { RiskEvaluationService } from './risk-evaluation.service';
import { CompanyRegistrationService } from './company-registration.service';
import { NotificationService } from './notification.service';
import { DatabaseModule } from '@org/database';
import { InvestmentWorkflowService } from './investment-workflow.service';
import { AuthModule } from '@org/auth';
import { MessageBrokerModule } from '@org/message-broker';

@Module({
  imports: [
    ConfigModule,
    ExternalIntegrationModule,
    DatabaseModule,
    AuthModule,
    MessageBrokerModule
  ],
  providers: [
    WorkflowAutomationService,
    RiskEvaluationService,
    CompanyRegistrationService,
    NotificationService,
    InvestmentWorkflowService,
  ],
  exports: [
    WorkflowAutomationService,
    RiskEvaluationService,
    CompanyRegistrationService,
    NotificationService,
    InvestmentWorkflowService,
  ],
})
export class WorkflowModule {}
