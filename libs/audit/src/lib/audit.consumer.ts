import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuditService } from './audit.service';
import type {
  InvestmentApprovedEvent,
  InvestmentRejectedEvent,
} from '@org/message-broker';

@Controller()
export class AuditConsumer {
  private readonly logger = new Logger(AuditConsumer.name);

  constructor(private readonly auditService: AuditService) {}

  @EventPattern('INVESTMENT_APPROVED')
  async handleApproved(
    @Payload() message: InvestmentApprovedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log('AUDIT APPROVED RECEIVED');

      await this.auditService.create(
        'INVESTMENT_APPROVED',
        message.investmentId,
        { ...message },
      );

      channel.ack(originalMsg);
    } catch (error) {
      console.error(error);
      channel.nack(originalMsg, false, false);
    }
  }

  @EventPattern('INVESTMENT_REJECTED')
  async handleRejected(
    @Payload() message: InvestmentRejectedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log('AUDIT REJECTED RECEIVED');

      await this.auditService.create(
        'INVESTMENT_REJECTED',
        message.investmentId,
        { ...message },
      );

      channel.ack(originalMsg);
    } catch (error) {
      console.error(error);
      channel.nack(originalMsg, false, false);
    }
  }
}
