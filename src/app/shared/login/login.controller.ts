import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';

@Controller()
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly errorService: ErrorsService,
  ) {}

  @Post('logon')
  async create(@Body() createLoginDto: CreateLoginDto) {
    try {
      return await this.loginService.createUser(createLoginDto);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o usuário',
        'createUser',
      );
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    try {
      return await this.loginService.login(req.user);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o usuário',
        'createUser',
      );
    }
  }

  // @Get()
  // findAll() {
  //   return this.loginService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.loginService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLoginDto: UpdateLoginDto) {
  //   return this.loginService.update(+id, updateLoginDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.loginService.remove(+id);
  // }
}
