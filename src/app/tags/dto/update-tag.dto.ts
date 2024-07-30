import { IsString } from 'class-validator';

export class UpdateTagDto {
  @IsString()
  tagName: string;

  @IsString()
  tagId: string;
}
