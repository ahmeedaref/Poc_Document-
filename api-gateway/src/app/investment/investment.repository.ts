import { Injectable } from '@nestjs/common';
import { createInvestmentDto } from './Dto/create.investment';
import { PrismaService } from '@org/database';
@Injectable()
export class InvestmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: createInvestmentDto) {
    return this.prisma.investment.create({
      data,
    });
  }

  findAll() {
    return this.prisma.investment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.investment.findUnique({
      where: {
        id,
      },
    });
  }

  updateProcessInstance(id: string, processInstanceId: string) {
    return this.prisma.investment.update({
      where: {
        id,
      },
      data: {
        processInstanceId,
      },
    });
  }

  async findByProcessInstanceId(processInstanceId: string) {
    return this.prisma.investment.findFirst({
      where: {
        processInstanceId,
      },
    });
  }
  async updateStatus(id: string, status: string) {
    return this.prisma.investment.update({
      where: { id },
      data: { status },
    });
  }
  async findUserByKeycloakId(keycloakId: string) {
    return this.prisma.user.findUnique({
      where: {
        keycloakId,
      },
    });
  }
}
