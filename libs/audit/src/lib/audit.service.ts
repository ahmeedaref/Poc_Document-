import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './schemas/audit-log.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditModel: Model<AuditLog>,
  ) {}

  async create(event: string, entityId: string, payload: Record<string, unknown >) {
    return this.auditModel.create({
      eventType: event,
      investmentId: entityId,
      payload,
    });
  }
}
