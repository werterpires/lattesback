import { Module } from '@nestjs/common';
// import { CurriculumService } from './curriculum.service';
import { CurriculumSqlService } from './curriculum-sql.service';
import { CurriculumController } from './curriculum.controller';
// import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CurriculumSchema } from './schemas/curriculum.schema';
import { CurriculumEntity } from './entities/curriculum.entity';
import { TagEntity } from '../tags/entities/tag.entity';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';

@Module({
  imports: [
    // MongoDB (comentado - migrado para SQL Server)
    // MongooseModule.forFeature([
    //   { name: 'Curriculum', schema: CurriculumSchema },
    // ]),
    // SQL Server (ativo)
    TypeOrmModule.forFeature([CurriculumEntity, TagEntity]),
  ],
  controllers: [CurriculumController],
  providers: [/* CurriculumService, */ CurriculumSqlService, ErrorsService],
})
export class CurriculumModule {}
