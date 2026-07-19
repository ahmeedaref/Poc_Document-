import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { InvestmentApprovedEvent, InvestmentRejectedEvent } from './events';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private investmentClient!: ClientProxy;
  private auditClient!: ClientProxy;

  onModuleInit() {
    this.investmentClient = ClientProxyFactory.create({
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

    this.auditClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: 'audit_events',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  publishInvestmentApproved(payload: InvestmentApprovedEvent) {
    console.log('PUBLISH APPROVED EVENT', payload.investmentId);

    this.investmentClient.emit('INVESTMENT_APPROVED', payload);

    this.auditClient.emit('INVESTMENT_APPROVED', payload);
  }
  publishInvestmentRejected(payload: InvestmentRejectedEvent) {
    this.investmentClient.emit('INVESTMENT_REJECTED', payload);

    this.auditClient.emit('INVESTMENT_REJECTED', payload);
  }
}
