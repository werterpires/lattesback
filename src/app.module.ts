import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorsService } from './app/shared/shared-services/errors-service/errors-service.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginModule } from './app/shared/login/login.module';
import { AuthModule } from './app/shared/auth/auth.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.DATABASECONECT), LoginModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, ErrorsService],
})
export class AppModule {}
