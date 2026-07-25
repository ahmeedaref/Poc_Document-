import { Module, Global } from '@nestjs/common';
import { NationalIdService } from './services/national-id.service';
import { TaxClearanceService } from './services/tax-clearance.service';
import { ExternalMockController } from './controllers/external-mock.controller';
import { ExternalIntegrationService } from './external-integration.service';
@Global()
@Module({
  controllers: [ExternalMockController],
  providers: [
    NationalIdService,
    TaxClearanceService,
    ExternalIntegrationService,
  ],
  exports: [ExternalIntegrationService, NationalIdService, TaxClearanceService],
})
export class ExternalIntegrationModule {}
