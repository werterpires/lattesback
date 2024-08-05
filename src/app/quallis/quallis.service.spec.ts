import { Test, TestingModule } from '@nestjs/testing';
import { QuallisService } from './quallis.service';

describe('QuallisService', () => {
  let service: QuallisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuallisService],
    }).compile();

    service = module.get<QuallisService>(QuallisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
