import { Injectable } from '@nestjs/common';

@Injectable()
export class NationalIdService {
  async verify(nationalId: string) {
    return {
      nationalId,
      valid: true,
      name: 'Test User',
    };
  }
}
