import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly errorService: ErrorsService,
  ) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    try {
      return this.tagsService.create(createTagDto);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar a tag',
        'create',
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.tagsService.findAll();
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao buscar as tags',
        'findAll',
      );
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tagsService.findOne(+id);
  // }

  @Put()
  update(@Body() updateTagDto: UpdateTagDto) {
    try {
      return this.tagsService.update(updateTagDto);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao atualizar a tag',
        'update',
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.tagsService.remove(id);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao remover a tag',
        'remove',
      );
    }
  }
}
