import { Test, TestingModule } from '@nestjs/testing';
import { QuallisController } from './quallis.controller';
import { QuallisService } from './quallis.service';

describe('QuallisController', () => {
  let controller: QuallisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuallisController],
      providers: [QuallisService],
    }).compile();

    controller = module.get<QuallisController>(QuallisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
