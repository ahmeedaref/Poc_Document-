import { Test, TestingModule } from '@nestjs/testing';
import { FlowableService } from './flowable.service';

describe('FlowableService', () => {
  let service: FlowableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowableService],
    }).compile();

    service = module.get<FlowableService>(FlowableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
