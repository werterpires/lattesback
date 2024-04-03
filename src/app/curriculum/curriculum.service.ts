import { Injectable } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Curriculum } from './schemas/curriculum.schema';
import { Model } from 'mongoose';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';
import { ICurriculum } from './types';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectModel(Curriculum.name) private curriculumModel: Model<Curriculum>,
    private readonly errorService: ErrorsService,
  ) {}

  async createOrUpdateCurriculums(curriculumsDto: CreateCurriculumDto) {
    try {
      const { curriculums } = curriculumsDto;
      const curriculumsToCreate = [];
      const curriculumsToUpdate = [];

      for (const curriculum of curriculums) {
        const savedCurriculum = await this.curriculumModel.findOne({
          lattesId: curriculum.lattesId,
        });

        if (!savedCurriculum) {
          curriculumsToCreate.push(curriculum);
        } else if (savedCurriculum.updatedDate < curriculum.updatedDate) {
          curriculumsToUpdate.push(curriculum);
        }
      }

      if (curriculumsToCreate.length > 0) {
        await this.curriculumModel.insertMany(curriculumsToCreate);
      }

      if (curriculumsToUpdate.length > 0) {
        await this.curriculumModel.updateMany(
          { lattesId: { $in: curriculumsToUpdate.map((c) => c.lattesId) } },
          { $set: { curriculum: curriculumsToUpdate } },
        );
      }

      const createdLattesId = curriculumsToCreate.map((c) => c.lattesId);
      const updatedLattesId = curriculumsToUpdate.map((c) => c.lattesId);
      const importantLattesId = [...createdLattesId, ...updatedLattesId];
      const curriculumsData = await this.curriculumModel.find({
        lattesId: { $in: importantLattesId },
      });

      return curriculumsData.map((createCurriculumFromDBData) =>
        this.createCurriculumFromDBData(createCurriculumFromDBData),
      );
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o Curriculum',
        'createOrUpdateCurriculums',
      );
    }
  }

  async findAllCurriculums(): Promise<Curriculum[]> {
    try {
      const curriculumsData = await this.curriculumModel.find();

      return curriculumsData.map((createCurriculumFromDBData) =>
        this.createCurriculumFromDBData(createCurriculumFromDBData),
      );
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao buscar o Curriculum',
        'findAllCurriculums',
      );
    }
  }

  createCurriculumFromDBData(createCurriculumFromDBData: any): ICurriculum {
    const curriculum: ICurriculum = {
      _id: createCurriculumFromDBData._id,
      lattesId: createCurriculumFromDBData.lattesId,
      curriculum: createCurriculumFromDBData.curriculum,
      active: createCurriculumFromDBData.active,
      serviceYears: createCurriculumFromDBData.serviceYears,
      updatedDate: createCurriculumFromDBData.updatedDate,
    };
    return curriculum;
  }
}
