import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorsService } from './app/shared/shared-services/errors-service/errors-service.service';
// import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './app/shared/login/login.module';
import { AuthModule } from './app/shared/auth/auth.module';
import * as dotenv from 'dotenv';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './app/shared/auth/guards/jwt-auth.guard';
import { CurriculumModule } from './app/curriculum/curriculum.module';
import { TagsModule } from './app/tags/tags.module';
import { QuallisModule } from './app/quallis/quallis.module';
dotenv.config();

@Module({
  imports: [
    // MongoDB (comentado - migrado para SQL Server)
    // MongooseModule.forRoot(process.env.DATABASECONECT),
    // SQL Server (ativo)
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 1433,
      username: process.env.DB_USERNAME || 'sa',
      password: process.env.DB_PASSWORD || 'YourStrong@Passw0rd',
      database: process.env.DB_DATABASE || 'lates_project',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
      logging: process.env.DB_LOGGING === 'true' || false,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }),
    LoginModule,
    AuthModule,
    CurriculumModule,
    TagsModule,
    QuallisModule,
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
