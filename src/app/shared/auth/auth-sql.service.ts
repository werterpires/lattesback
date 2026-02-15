import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../login/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { IUser } from '../login/types';

@Injectable()
export class AuthSqlService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly errorsService: ErrorsService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const completUser = await this.userRepository.findOne({
        where: { email },
      });

      if (!completUser) {
        throw new UnauthorizedException('#Email e/ou senha incorretos.');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        completUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('#Email e/ou senha incorretos.');
      }

      const user: IUser = {
        userId: completUser.id,
        name: completUser.name,
        email: completUser.email,
        role: completUser.role,
      };
      return user;
    } catch (error) {
      throw this.errorsService.handleErrors(
        error,
        '#Email e/ou senha incorretos.',
        'auth/validateUser (SQL)',
      );
    }
  }
}
