import { Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
// import { UpdateLoginDto } from './dto/update-login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly errorService: ErrorsService,
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
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o login',
        'createUser',
      );
    }
  }

  // findAll() {
  //   return `This action returns all login`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} login`;
  // }

  // update(id: number, updateLoginDto: UpdateLoginDto) {
  //   return `This action updates a #${id} login`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} login`;
  // }
}
