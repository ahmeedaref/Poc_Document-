import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getData() {
    return {
      message: 'API Gateway is running',
      port: this.configService.get<number>('app.port'),
    };
  }
}
