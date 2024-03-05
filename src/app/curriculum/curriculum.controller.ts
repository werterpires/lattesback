import { Controller, Post, Body } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';

@Controller('curriculum')
export class CurriculumController {
  constructor(
    private readonly curriculumService: CurriculumService,
    private readonly errorService: ErrorsService,
  ) {}

  @Post()
  create(@Body() createCurriculumDto: CreateCurriculumDto) {
    try {
      return this.curriculumService.createOrUpdateCurriculums(
        createCurriculumDto,
      );
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o Curriculum',
        'create',
      );
    }
  }
}
