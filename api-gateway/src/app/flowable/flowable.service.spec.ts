import { Test, TestingModule } from '@nestjs/testing';
import { FlowableService } from './flowable.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('FlowableService', () => {
  let service: FlowableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowableService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FlowableService>(FlowableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
