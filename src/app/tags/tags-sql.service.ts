import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
import { CurriculumEntity } from '../curriculum/entities/curriculum.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';

@Injectable()
export class TagsSqlService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    @InjectRepository(CurriculumEntity)
    private curriculumRepository: Repository<CurriculumEntity>,
    private readonly errorService: ErrorsService,
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      // Verificar se já existe uma tag com o mesmo nome
      const existingTag = await this.tagRepository.findOne({
        where: { tagName: createTagDto.tagName },
      });

      if (existingTag) {
        throw new BadRequestException('#Já existe uma tag com este nome.');
      }

      const tag = this.tagRepository.create({ ...createTagDto });
      return await this.tagRepository.save(tag);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar a tag (SQL)',
        'create',
      );
    }
  }

  async findAll() {
    try {
      return await this.tagRepository.find();
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao buscar as tags (SQL)',
        'findAll',
      );
    }
  }

  async update(updateTagDto: UpdateTagDto) {
    try {
      // Verificar se já existe outra tag com o mesmo nome
      const existingTag = await this.tagRepository.findOne({
        where: { tagName: updateTagDto.tagName },
      });

      if (existingTag && existingTag.id !== updateTagDto.tagId) {
        throw new BadRequestException('#Já existe uma tag com este nome.');
      }

      return await this.tagRepository.update(
        { id: updateTagDto.tagId },
        { tagName: updateTagDto.tagName },
      );
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao atualizar a tag (SQL)',
        'update',
      );
    }
  }

  async remove(id: string) {
    try {
      // Verificar se a tag está em uso através da junction table
      const existingUses = await this.curriculumRepository
        .createQueryBuilder('curriculum')
        .innerJoin('curriculum.tags', 'tag')
        .where('tag.id = :id', { id })
        .getCount();

      if (existingUses > 0) {
        throw new BadRequestException(
          '#Esta tag está em uso e por isso não pode ser apagada.',
        );
      }

      const result = await this.tagRepository.delete(id);
      return result;
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao remover a tag (SQL)',
        'remove',
      );
    }
  }
}
