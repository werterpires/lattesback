import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
// import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from './schemas/tag.schema';
import { Model, Types } from 'mongoose';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';
import { Curriculum } from '../curriculum/schemas/curriculum.schema';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
    @InjectModel(Curriculum.name) private curriculumModel: Model<Curriculum>,
    private readonly errorService: ErrorsService,
  ) {}

  create(createTagDto: CreateTagDto) {
    try {
      return this.tagModel.create({ ...createTagDto });
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar a tag',
        'create',
      );
    }
  }

  async findAll() {
    try {
      return await this.tagModel.find();
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao buscar as tags',
        'findAll',
      );
    }
  }

  update(updateTagDto: UpdateTagDto) {
    try {
      const tagId = new Types.ObjectId(updateTagDto.tagId);

      return this.tagModel.updateOne(
        { _id: tagId },
        { $set: { tagName: updateTagDto.tagName } },
      );
    } catch (error) {}
  }

  async remove(id: string) {
    try {
      const existingUses: number = await this.curriculumModel.countDocuments({
        tags: { $in: [new Types.ObjectId(id)] },
      });
      if (existingUses > 0) {
        throw new BadRequestException(
          '#Esta tag está em uso e por isso não pode ser apagada.',
        );
      }
      return await this.tagModel.findByIdAndDelete(id);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao remover a tag',
        'remove',
      );
    }
  }
}
