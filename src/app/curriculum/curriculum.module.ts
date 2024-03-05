import { Module } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CurriculumSchema } from './schemas/curriculum.schema';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Curriculum', schema: CurriculumSchema },
    ]),
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService, ErrorsService],
})
export class CurriculumModule {}
