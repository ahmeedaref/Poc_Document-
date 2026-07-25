import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class CompanyRegistrationService {
  async register(companyName: string) {
    console.log(`Registering company: ${companyName}`);

    return {
      registrationNumber: randomUUID(),
      status: 'REGISTERED',
      companyName,
    };
  }
}
