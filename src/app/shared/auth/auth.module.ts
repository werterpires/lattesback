import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
import { AuthSqlService } from './auth-sql.service';
import { AuthController } from './auth.controller';
import { LoginModule } from '../login/login.module';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
// import { LocalStrategy } from './strategies/local.strategy';
import { LocalSqlStrategy } from './strategies/local-sql.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [LoginModule],
  controllers: [AuthController],
  providers: [
    // AuthService,
    AuthSqlService,
    ErrorsService,
    // LocalStrategy,
    LocalSqlStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
