import { Injectable } from '@nestjs/common';

@Injectable()
export class TaxClearanceService {
  async verify(companyId: string) {
    return {
      companyId,
      taxClearance: true,
    };
  }
}
