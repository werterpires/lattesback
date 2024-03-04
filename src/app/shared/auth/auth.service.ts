import { Injectable, UnauthorizedException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from '../login/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { IUser } from '../login/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly errorsService: ErrorsService,
  ) {}
  async validateUser(email: string, password: string) {
    try {
      const completUser = await this.userModel.findOne({ email });

      const isPasswordValid = await bcrypt.compare(
        password,
        completUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('#Email e/ou senha incorretos.');
      }

      const user: IUser = {
        userId: completUser._id,
        name: completUser.name,
        email: completUser.email,
        role: completUser.role,
      };
      return user;
    } catch (error) {
      throw this.errorsService.handleErrors(
        error,
        '#Email e/ou senha incorretos.',
        'auth/validateUser',
      );
    }
  }
}
