import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { ErrorsService } from '../shared-services/errors-service/errors-service.service';

@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly errorService: ErrorsService,
  ) {}

  @Post()
  async create(@Body() createLoginDto: CreateLoginDto) {
    try {
      return await this.loginService.createUser(createLoginDto);
    } catch (error) {
      throw this.errorService.handleErrors(
        error,
        'Erro ao criar o login',
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
