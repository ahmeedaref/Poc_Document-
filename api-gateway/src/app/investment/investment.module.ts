import { Module } from '@nestjs/common';
import { InvestmentController } from './investment.controller';
import { InvestmentService } from './investment.service';
import { FlowableModule } from '../flowable/flowable.module';
import { InvestmentRepository } from './investment.repository';
import { UsersModule } from '../users/users.module';
import { MessageBrokerModule } from '@org/message-broker';
@Module({
  imports: [FlowableModule, UsersModule, MessageBrokerModule],
  controllers: [InvestmentController],
  providers: [InvestmentService, InvestmentRepository],
})
export class InvestmentModule {}
