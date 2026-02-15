import { Module } from '@nestjs/common';
// import { TagsService } from './tags.service';
import { TagsSqlService } from './tags-sql.service';
import { TagsController } from './tags.controller';
// import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { TagSchema } from './schemas/tag.schema';
import { TagEntity } from './entities/tag.entity';
import { CurriculumEntity } from '../curriculum/entities/curriculum.entity';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';
// import { CurriculumSchema } from '../curriculum/schemas/curriculum.schema';

@Module({
  imports: [
    // MongoDB (comentado - migrado para SQL Server)
    // MongooseModule.forFeature([
    //   { name: 'Tag', schema: TagSchema },
    //   { name: 'Curriculum', schema: CurriculumSchema },
    // ]),
    // SQL Server (ativo)
    TypeOrmModule.forFeature([TagEntity, CurriculumEntity]),
  ],
  controllers: [TagsController],
  providers: [/* TagsService, */ TagsSqlService, ErrorsService],
})
export class TagsModule {}
