import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'app.port') {
                return 3000;
              }
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return API Gateway message', () => {
      expect(service.getData()).toEqual({
        message: 'API Gateway is running',
        port: 3000,
      });
    });
  });
});
