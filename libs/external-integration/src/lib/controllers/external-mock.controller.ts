import { Controller, Get, Param } from '@nestjs/common';
import { ExternalIntegrationService } from '../external-integration.service';
@Controller('external')
export class ExternalMockController {
  constructor(
    private readonly externalIntegrationService: ExternalIntegrationService,
  ) {}

  @Get('verify/:nationalId/:companyId')
  async verify(
    @Param('nationalId') nationalId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.externalIntegrationService.verifyInvestment(
      nationalId,
      companyId,
    );
  }
}
