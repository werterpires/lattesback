import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './schemas/tag.schema';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';
import { CurriculumSchema } from '../curriculum/schemas/curriculum.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Tag', schema: TagSchema },
      { name: 'Curriculum', schema: CurriculumSchema },
    ]),
  ],
  controllers: [TagsController],
  providers: [TagsService, ErrorsService],
})
export class TagsModule {}
