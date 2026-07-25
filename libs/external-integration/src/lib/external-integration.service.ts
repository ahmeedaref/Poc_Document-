import { Injectable } from '@nestjs/common';
import { TaxClearanceService } from './services/tax-clearance.service';
import { NationalIdService } from './services/national-id.service';

@Injectable()
export class ExternalIntegrationService {
  constructor(
    private readonly nationalIdService: NationalIdService,
    private readonly taxClearanceService: TaxClearanceService,
  ) {}

  async verifyInvestment(nationalId: string, companyId: string) {
    const nationalIdResult = await this.nationalIdService.verify(nationalId);

    const taxResult = await this.taxClearanceService.verify(companyId);

    return {
      nationalIdVerified: nationalIdResult.valid,
      taxClearance: taxResult.taxClearance,
      status:
        nationalIdResult.valid && taxResult.taxClearance ? 'PASSED' : 'FAILED',
    };
  }
}
