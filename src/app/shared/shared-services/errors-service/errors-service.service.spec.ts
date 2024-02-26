import { Test, TestingModule } from '@nestjs/testing';
import { ErrorsServiceService } from './errors-service.service';

describe('ErrorsServiceService', () => {
  let service: ErrorsServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorsServiceService],
    }).compile();

    service = module.get<ErrorsServiceService>(ErrorsServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
