import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import type { InvestmentApprovedEvent } from './events';

@Controller()
export class RabbitMQConsumer {
  @EventPattern('INVESTMENT_APPROVED')
  async handleInvestmentApproved(
    @Payload() event: InvestmentApprovedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      console.log('========== EVENT RECEIVED ==========');
      console.log(event);

      channel.ack(message);

      console.log('========== ACK SENT ==========');
    } catch (error) {
      console.error(error);

      channel.nack(message, false, false);
    }
  }
}
