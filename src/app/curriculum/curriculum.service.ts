import { Injectable } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Curriculum } from './schemas/curriculum.schema';
import { Model } from 'mongoose';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';

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
          console.log('savedCurriculum', savedCurriculum);
          console.log('curriculumsToCreateA', curriculumsToCreate);
        } else if (savedCurriculum.updatedDate < curriculum.updatedDate) {
          curriculumsToUpdate.push(curriculum);
        }
      }

      console.log('curriculumsToCreateB', curriculumsToCreate);

      if (curriculumsToCreate.length > 0) {
        const createdDocuments =
          await this.curriculumModel.insertMany(curriculumsToCreate);
        console.log(createdDocuments);
      }

      if (curriculumsToUpdate.length > 0) {
        const updatedDocuments = await this.curriculumModel.updateMany(
          { lattesId: { $in: curriculumsToUpdate.map((c) => c.lattesId) } },
          { $set: { curriculum: curriculumsToUpdate } },
        );
        console.log(updatedDocuments);
      }
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o Curriculum',
        'createOrUpdateCurriculums',
      );
    }
  }
}
