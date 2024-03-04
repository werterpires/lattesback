import { Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
// import { UpdateLoginDto } from './dto/update-login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { IUserPayload, UserToken } from '../auth/types';
import { IUser } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly errorService: ErrorsService,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(createLoginDto: CreateLoginDto) {
    try {
      const password = await bcrypt.hash(createLoginDto.password, 10);
      const createUserData = new this.userModel({
        name: createLoginDto.name,
        email: createLoginDto.email,
        password,
        role: createLoginDto.role,
      });
      const createdUser = await createUserData.save();
      const user: IUser = {
        userId: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      };

      return user;
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o login',
        'createUser',
      );
    }
  }

  login(user: IUser): UserToken {
    const payload: IUserPayload = {
      sub: user.userId.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const jwtToken = this.jwtService.sign(payload);
    return {
      accessToken: jwtToken,
    };
  }
}
