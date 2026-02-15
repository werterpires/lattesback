import { Module } from '@nestjs/common';
// import { LoginService } from './login.service';
import { LoginSqlService } from './login-sql.service';
import { LoginController } from './login.controller';
// import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserSchema } from './schemas/user.schema';
import { UserEntity } from './entities/user.entity';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    // MongoDB (comentado - migrado para SQL Server)
    // MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    // SQL Server (ativo)
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [LoginController],
  providers: [/* LoginService, */ LoginSqlService, ErrorsService],
  exports: [
    // LoginService,
    LoginSqlService,
    // MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class LoginModule {}
