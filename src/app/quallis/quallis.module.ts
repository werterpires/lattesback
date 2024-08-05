import { Module } from '@nestjs/common';
import { QuallisService } from './quallis.service';
import { QuallisController } from './quallis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuallisSchema } from './schemas/quallis.schema';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Quallis', schema: QuallisSchema }]),
  ],
  controllers: [QuallisController],
  providers: [QuallisService, ErrorsService],
})
export class QuallisModule {}
