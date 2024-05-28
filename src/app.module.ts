import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorsService } from './app/shared/shared-services/errors-service/errors-service.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginModule } from './app/shared/login/login.module';
import { AuthModule } from './app/shared/auth/auth.module';
import * as dotenv from 'dotenv';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './app/shared/auth/guards/jwt-auth.guard';
import { CurriculumModule } from './app/curriculum/curriculum.module';
import { TagsModule } from './app/tags/tags.module';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASECONECT),
    LoginModule,
    AuthModule,
    CurriculumModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ErrorsService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
