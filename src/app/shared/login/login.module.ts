import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, ErrorsService],
  exports: [
    LoginService,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
})
export class LoginModule {}
