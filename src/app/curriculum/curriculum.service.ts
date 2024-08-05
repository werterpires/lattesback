import { Injectable } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Curriculum } from './schemas/curriculum.schema';
import { Model, Types } from 'mongoose';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';
import { CreateCurriculum, ICurriculum, IUpdateCurriculum } from './types';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectModel(Curriculum.name) private curriculumModel: Model<Curriculum>,
    private readonly errorService: ErrorsService,
  ) {}

  async createOrUpdateCurriculums(curriculumsDto: CreateCurriculumDto) {
    try {
      const { curriculums } = curriculumsDto;
      const curriculumsToCreate: CreateCurriculum[] = [];
      const curriculumsToUpdate: CreateCurriculum[] = [];

      for (const curriculum of curriculums) {
        const savedCurriculum = await this.curriculumModel.findOne({
          lattesId: curriculum.lattesId,
        });

        if (!savedCurriculum) {
          curriculumsToCreate.push(curriculum);
        } else if (savedCurriculum.updatedDate < curriculum.updatedDate) {
          curriculum.serviceYears = savedCurriculum.serviceYears;
          curriculum.active = savedCurriculum.active;
          curriculumsToUpdate.push(curriculum);
        }
      }

      if (curriculumsToCreate.length > 0) {
        await this.curriculumModel.insertMany(curriculumsToCreate);
      }

      if (curriculumsToUpdate.length > 0) {
        curriculumsToUpdate.forEach((c) => {
          console.log('Currículo a atualizar:', c);

          this.curriculumModel
            .updateOne(
              { lattesId: c.lattesId },
              {
                $set: {
                  updatedDate: c.updatedDate,
                  curriculum: c.curriculum,
                },
              },
            )
            .then((res) => {
              console.log(
                `Currículo com lattesId ${c.lattesId} atualizado com sucesso:`,
                res,
              );
            })
            .catch((err) => {
              console.error(
                `Erro ao atualizar currículo com lattesId ${c.lattesId}:`,
                err,
              );
            });
        });
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

  async updteCurriculum(updateCurriculumData: UpdateCurriculumDto) {
    try {
      const updateData: IUpdateCurriculum = {
        active: updateCurriculumData.active,
        serviceYears: updateCurriculumData.serviceYears.join(' '),
        tags: updateCurriculumData.tagsIds.map((t) => new Types.ObjectId(t)),
      };
      return await this.curriculumModel.updateOne(
        { lattesId: updateCurriculumData.lattesId },
        { $set: updateData },
      );
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao atualizar o Curriculum',
        'updteCurriculum',
      );
    }
  }

  async findAllCurriculums(): Promise<Curriculum[]> {
    try {
      const curriculumsData = await this.curriculumModel
        .find()
        .populate({ path: 'tags', select: 'tagName', model: 'Tag' })
        .exec();

      const curriculums = curriculumsData.map((createCurriculumFromDBData) =>
        this.createCurriculumFromDBData(createCurriculumFromDBData),
      );

      return curriculums;
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
      tags: createCurriculumFromDBData.tags,
    };
    return curriculum;
  }
}
