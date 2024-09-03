import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginDto } from './create-login.dto';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateLoginDto) {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    {
      message:
        'kkkA senha deve conter entre 8 e 20 caracteres, pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial.',
    },
  )
  password: string;

  @IsString()
  role: string;
}
