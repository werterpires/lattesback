import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';

@Controller('curriculum')
export class CurriculumController {
  constructor(
    private readonly curriculumService: CurriculumService,
    private readonly errorService: ErrorsService,
  ) {}

  @Post()
  async create(@Body() createCurriculumDto: CreateCurriculumDto) {
    try {
      const tamanhoPayload = JSON.stringify(createCurriculumDto).length;
      console.log(`Tamanho do payload: ${tamanhoPayload / (1024 * 1024)} MB`);
      return await this.curriculumService.createOrUpdateCurriculums(
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

  @Get()
  async getAll() {
    try {
      return await this.curriculumService.findAllCurriculums();
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao buscar o Curriculum',
        'getAll',
      );
    }
  }

  @Put()
  async update(@Body() updateCurriculumDto: UpdateCurriculumDto) {
    try {
      return await this.curriculumService.updteCurriculum(updateCurriculumDto);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao atualizar o Curriculum',
        'update',
      );
    }
  }
}
