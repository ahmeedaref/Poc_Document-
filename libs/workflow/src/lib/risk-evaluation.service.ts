import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskEvaluationService {
  evaluate(investmentAmount: number) {
    if (investmentAmount < 50000) {
      return 'LOW';
    }

    if (investmentAmount < 200000) {
      return 'MEDIUM';
    }

    return 'HIGH';
  }
}
