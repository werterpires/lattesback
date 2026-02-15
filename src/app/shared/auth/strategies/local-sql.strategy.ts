import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthSqlService } from '../auth-sql.service';

@Injectable()
export class LocalSqlStrategy extends PassportStrategy(Strategy, 'local-sql') {
  constructor(private authSqlService: AuthSqlService) {
    super({ usernameField: 'email' });
  }

  validate(email: string, password: string) {
    return this.authSqlService.validateUser(email, password);
  }
}
