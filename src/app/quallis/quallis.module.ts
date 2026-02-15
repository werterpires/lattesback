import { Module } from '@nestjs/common';
// import { QuallisService } from './quallis.service';
import { QuallisSqlService } from './quallis-sql.service';
import { QuallisController } from './quallis.controller';
// import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { QuallisSchema } from './schemas/quallis.schema';
import { QuallisEntity } from './entities/quallis.entity';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';

@Module({
  imports: [
    // MongoDB (comentado - migrado para SQL Server)
    // MongooseModule.forFeature([{ name: 'Quallis', schema: QuallisSchema }]),
    // SQL Server (ativo)
    TypeOrmModule.forFeature([QuallisEntity]),
  ],
  controllers: [QuallisController],
  providers: [/* QuallisService, */ QuallisSqlService, ErrorsService],
})
export class QuallisModule {}
