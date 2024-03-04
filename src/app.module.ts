import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorsServiceService } from './app/shared/shared-services/errors-service/errors-service.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginModule } from './app/shared/login/login.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.DATABASECONECT), LoginModule],
  controllers: [AppController],
  providers: [AppService, ErrorsServiceService],
})
export class AppModule {}
