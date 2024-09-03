import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserFromJwt } from '../auth/types';
import { UpdateUserDto } from './dto/update-login.dto';

@Controller()
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly errorService: ErrorsService,
  ) {}

  @Post('logon')
  async create(
    @Body() createLoginDto: CreateLoginDto,
    @CurrentUser() user: IUserFromJwt,
  ) {
    try {
      return await this.loginService.createUser(createLoginDto, user);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        '#Erro ao criar o usuário',
        'createUser',
      );
    }
  }
  @IsPublic()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    try {
      return await this.loginService.login(req.user);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        '#Erro ao criar o usuário',
        'createUser',
      );
    }
  }

  @Get('users')
  async findAllUsers(@CurrentUser() user: IUserFromJwt) {
    try {
      return await this.loginService.findAllUsers(user);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        '#Erro ao buscar os usuários',
        'findAllUsers',
      );
    }
  }

  @Put('users')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: IUserFromJwt,
  ) {
    try {
      return await this.loginService.updateUser(updateUserDto, user);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao atualizar o usuário',
        'updateUser',
      );
    }
  }

  @Delete('users/:userId')
  async deleteUser(
    @Param('userId') userId: string,
    @CurrentUser() user: IUserFromJwt,
  ) {
    try {
      return await this.loginService.deleteUser(userId, user);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao deletar o usuário',
        'deleteUser',
      );
    }
  }
}
