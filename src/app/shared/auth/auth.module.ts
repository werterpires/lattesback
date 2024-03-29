import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginModule } from '../login/login.module';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [LoginModule],
  controllers: [AuthController],
  providers: [AuthService, ErrorsService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
