import { IsString, Matches } from 'class-validator';

export class CreateLoginDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    {
      message:
        'A senha deve conter entre 8 e 20 caracteres, pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial.',
    },
  )
  password: string;

  @IsString()
  role: string;
}
