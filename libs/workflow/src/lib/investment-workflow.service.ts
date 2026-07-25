import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';

@Injectable()
export class InvestmentWorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  async completeInvestment(
    processInstanceId: string,
    status: 'APPROVED' | 'REJECTED',
  ) {
    const investment = await this.prisma.investment.findFirst({
      where: {
        processInstanceId,
      },
    });

    if (!investment) {
      throw new Error('Investment not found for process instance');
    }

    return this.prisma.investment.update({
      where: {
        id: investment.id,
      },
      data: {
        status,
      },
    });
  }
}
