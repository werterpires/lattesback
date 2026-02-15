import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CurriculumEntity } from './entities/curriculum.entity';
import { TagEntity } from '../tags/entities/tag.entity';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';
import { CreateCurriculum } from './types';

@Injectable()
export class CurriculumSqlService {
  constructor(
    @InjectRepository(CurriculumEntity)
    private curriculumRepository: Repository<CurriculumEntity>,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    private readonly errorService: ErrorsService,
  ) {}

  async createOrUpdateCurriculums(curriculumsDto: CreateCurriculumDto) {
    try {
      const { curriculums } = curriculumsDto;
      const curriculumsToCreate: CreateCurriculum[] = [];
      const curriculumsToUpdate: CreateCurriculum[] = [];

      for (const curriculum of curriculums) {
        const savedCurriculum = await this.curriculumRepository.findOne({
          where: { lattesId: curriculum.lattesId },
        });

        if (!savedCurriculum) {
          curriculumsToCreate.push(curriculum);
        } else if (savedCurriculum.updatedDate < curriculum.updatedDate) {
          curriculum.serviceYears = savedCurriculum.serviceYears;
          curriculum.active = savedCurriculum.active;
          curriculumsToUpdate.push(curriculum);
        }
      }

      // Criar novos currículos
      if (curriculumsToCreate.length > 0) {
        const entities = curriculumsToCreate.map((c) => {
          const entity = new CurriculumEntity();
          entity.lattesId = c.lattesId;
          entity.curriculum = c.curriculum;
          entity.updatedDate = c.updatedDate;
          entity.active = c.active || false;
          entity.serviceYears = c.serviceYears || '';
          entity.tags = [];
          return entity;
        });
        await this.curriculumRepository.save(entities);
      }

      // Atualizar currículos existentes
      if (curriculumsToUpdate.length > 0) {
        for (const c of curriculumsToUpdate) {
          console.log('Currículo a atualizar:', c);
          try {
            await this.curriculumRepository.update(
              { lattesId: c.lattesId },
              {
                updatedDate: c.updatedDate,
                curriculum: c.curriculum,
              },
            );
            console.log(
              `Currículo com lattesId ${c.lattesId} atualizado com sucesso`,
            );
          } catch (err) {
            console.error(
              `Erro ao atualizar currículo com lattesId ${c.lattesId}:`,
              err,
            );
          }
        }
      }

      // Buscar currículos criados/atualizados
      const createdLattesId = curriculumsToCreate.map((c) => c.lattesId);
      const updatedLattesId = curriculumsToUpdate.map((c) => c.lattesId);
      const importantLattesId = [...createdLattesId, ...updatedLattesId];

      const curriculumsData = await this.curriculumRepository.find({
        where: { lattesId: In(importantLattesId) },
      });

      return curriculumsData.map((curriculum) =>
        this.createCurriculumFromDBData(curriculum),
      );
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o Curriculum (SQL)',
        'createOrUpdateCurriculums',
      );
    }
  }

  async updteCurriculum(updateCurriculumData: UpdateCurriculumDto) {
    try {
      // Buscar o currículo
      const curriculum = await this.curriculumRepository.findOne({
        where: { lattesId: updateCurriculumData.lattesId },
        relations: ['tags'],
      });

      if (!curriculum) {
        throw new Error('Curriculum não encontrado');
      }

      // Buscar tags pelos IDs
      const tags = await this.tagRepository.find({
        where: { id: In(updateCurriculumData.tagsIds) },
      });

      // Atualizar dados
      curriculum.active = updateCurriculumData.active;
      curriculum.serviceYears = updateCurriculumData.serviceYears.join(' ');
      curriculum.tags = tags;

      await this.curriculumRepository.save(curriculum);

      return { modified: 1 };
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao atualizar o Curriculum (SQL)',
        'updteCurriculum',
      );
    }
  }

  async findAllCurriculums(): Promise<any[]> {
    try {
      const curriculumsData = await this.curriculumRepository.find({
        relations: ['tags'],
      });

      return curriculumsData.map((curriculum) =>
        this.createCurriculumFromDBData(curriculum),
      );
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao buscar o Curriculum (SQL)',
        'findAllCurriculums',
      );
    }
  }

  createCurriculumFromDBData(curriculumData: CurriculumEntity): any {
    return {
      _id: curriculumData.id,
      lattesId: curriculumData.lattesId,
      curriculum: curriculumData.curriculum,
      active: curriculumData.active,
      serviceYears: curriculumData.serviceYears,
      updatedDate: curriculumData.updatedDate,
      tags: curriculumData.tags || [],
    };
  }
}
