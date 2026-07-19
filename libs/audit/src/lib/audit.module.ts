import { Module } from '@nestjs/common';
import { DatabaseModule } from '@org/database';
import { MessageBrokerModule } from '@org/message-broker';
import { AuditService } from './audit.service';
import { AuditConsumer } from './audit.consumer';

@Module({
  imports: [DatabaseModule, MessageBrokerModule],
  controllers: [AuditConsumer],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
