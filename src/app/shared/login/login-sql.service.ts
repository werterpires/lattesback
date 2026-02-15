import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateUserDto } from './dto/update-login.dto';
import * as bcrypt from 'bcrypt';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { IUserFromJwt, IUserPayload, UserToken } from '../auth/types';
import { IUser } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginSqlService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly errorService: ErrorsService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createLoginDto: CreateLoginDto, currentUser: IUserFromJwt) {
    try {
      if (currentUser.role !== 'admin') {
        throw new ForbiddenException('Usuário sem permissão');
      }

      if (createLoginDto.role !== 'admin') {
        createLoginDto.role = 'user';
      }

      const password = await bcrypt.hash(createLoginDto.password, 10);

      const createUserData = this.userRepository.create({
        name: createLoginDto.name,
        email: createLoginDto.email,
        password,
        role: createLoginDto.role,
      });

      const createdUser = await this.userRepository.save(createUserData);

      const user: IUser = {
        userId: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      };

      return user;
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o login (SQL)',
        'createUser',
      );
    }
  }

  async findAllUsers(currentUser: IUserFromJwt) {
    try {
      let users = await this.userRepository.find();

      users.forEach((user) => {
        (user as any).password = undefined;
      });

      if (currentUser.role !== 'admin') {
        users = users.filter((user) => user.id === currentUser.userId);
      }

      return users;
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao buscar os usuários (SQL)',
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
        throw new ForbiddenException('Usuário sem permissão');
      }

      if (currentUser.userId == updateUserDto.userId) {
        const userToUpdate = await this.userRepository.findOne({
          where: { id: updateUserDto.userId },
        });

        if (userToUpdate.role !== updateUserDto.role) {
          throw new ForbiddenException(
            '#Você não pode mudar seu próprio papel.',
          );
        }
      }

      await this.userRepository.update(
        { id: updateUserDto.userId },
        updateUserDto,
      );

      const user = await this.userRepository.findOne({
        where: { id: updateUserDto.userId },
      });
      (user as any).password = undefined;
      return user;
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao atualizar o login (SQL)',
        'updateUser',
      );
    }
  }

  async deleteUser(userId: string, currentUser: IUserFromJwt) {
    try {
      if (currentUser.role !== 'admin') {
        throw new ForbiddenException('Usuário sem permissão');
      }
      if (currentUser.userId == userId) {
        throw new BadRequestException(
          '#Você não pode deletar seu próprio usuário.',
        );
      }
      await this.userRepository.delete(userId);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao deletar o login (SQL)',
        'deleteUser',
      );
    }
  }
}
