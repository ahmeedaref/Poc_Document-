import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async create(
    event: string,
    entityId: string,
    payload: Prisma.InputJsonValue,
  ) {
    return this.prisma.auditLog.create({
      data: {
        event,
        entityId,
        payload,
      },
    });
  }
}
