import { Module } from '@nestjs/common';
import { MessageBrokerModule } from '@org/message-broker';
import { AuditService } from './audit.service';
import { AuditConsumer } from './audit.consumer';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';

@Module({
  imports: [
    MessageBrokerModule,
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [AuditConsumer],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
