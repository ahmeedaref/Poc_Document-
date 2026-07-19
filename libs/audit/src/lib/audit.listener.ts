import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuditService } from './audit.service';
import type {
  InvestmentApprovedEvent,
  InvestmentRejectedEvent,
} from '@org/message-broker';
@Controller()
export class AuditListener {
  constructor(private readonly auditService: AuditService) {}

  @EventPattern('INVESTMENT_APPROVED')
  async handleApproved(payload: InvestmentApprovedEvent) {
    console.log('🔥 AUDIT LISTENER RECEIVED', payload);
    await this.auditService.create(
      'INVESTMENT_APPROVED',
      payload.investmentId,
      { ...payload },
    );
  }

  @EventPattern('INVESTMENT_REJECTED')
  async handleRejected(payload: InvestmentRejectedEvent) {
    console.log('🔥 AUDIT LISTENER RECEIVED', payload);
    await this.auditService.create(
      'INVESTMENT_RIEJECTED',
      payload.investmentId,
      { ...payload },
    );
  }
}
