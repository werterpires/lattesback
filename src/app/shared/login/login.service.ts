import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
// import { UpdateLoginDto } from './dto/update-login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { IUserFromJwt, IUserPayload, UserToken } from '../auth/types';
import { IUser } from './types';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-login.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly errorService: ErrorsService,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(createLoginDto: CreateLoginDto, currentUser: IUserFromJwt) {
    try {
      if (currentUser.role !== 'admin') {
        throw new ForbiddenException('Usuário sem permissão');
      }

      if (createLoginDto.role !== 'admin') {
        createLoginDto.role == 'user';
      }
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

  async findAllUsers(currentUser: IUserFromJwt) {
    try {
      let users = await this.userModel.find();
      users.forEach((user) => {
        user.password = undefined;
      });

      if (currentUser.role !== 'admin') {
        users = users.filter(
          (user) => user._id.toString() === currentUser.userId,
        );
      }

      return users;
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao buscar os usuários',
        'findAllUsers',
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

  async updateUser(updateUserDto: UpdateUserDto, currentUser: IUserFromJwt) {
    try {
      if (currentUser.role !== 'admin') {
        throw new ForbiddenException('Usuário sem permissão');
      }

      if (currentUser.userId == updateUserDto.userId) {
        const userToUpdate = await this.userModel.findById(
          updateUserDto.userId,
        );

        if (userToUpdate.role !== updateUserDto.role) {
          throw new ForbiddenException(
            '#Você não pode mudar seu próprio papel.',
          );
        }
      }

      await this.userModel.findByIdAndUpdate(
        updateUserDto.userId,
        updateUserDto,
      );

      const user = await this.userModel.findById(updateUserDto.userId);
      user.password = undefined;
      return user;
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao atualizar o login',
        'updateUser',
      );
    }
  }

  async deleteUser(userId: string, currentUser: IUserFromJwt) {
    try {
      if (currentUser.role !== 'admin') {
        throw new ForbiddenException('Usuário sem permissão');
      }
      if (currentUser.userId == userId) {
        throw new BadRequestException(
          '#Você não pode deletar seu próprio usuário.',
        );
      }
      await this.userModel.findByIdAndDelete(userId);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao deletar o login',
        'deleteUser',
      );
    }
  }
}
