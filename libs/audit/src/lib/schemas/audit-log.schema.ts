import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({
  collection: 'audit_logs',
  timestamps: true,
})
export class AuditLog {
  @Prop({ required: true })
  eventType!: string;

  @Prop()
  investmentId?: string;

  @Prop({ type: Object })
  payload!: Record<string, any>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
