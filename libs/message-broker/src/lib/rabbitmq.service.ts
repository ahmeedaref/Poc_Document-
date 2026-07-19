import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { InvestmentApprovedEvent } from './events';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private client!: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,

      options: {
        urls: ['amqp://admin:admin@localhost:5672'],

        queue: 'investment_events',

        queueOptions: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': 'investment_retry_exchange',
            'x-dead-letter-routing-key': 'investment_retry',
          },
        },
      },
    });
  }

  publishInvestmentApproved(payload: InvestmentApprovedEvent) {
    return this.client.emit('INVESTMENT_APPROVED', payload);
  }
}
