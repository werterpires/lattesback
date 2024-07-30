import { IsBoolean, IsString } from 'class-validator';

export class UpdateCurriculumDto {
  @IsString({ each: true })
  serviceYears: string[];

  @IsBoolean()
  active: boolean;

  @IsString({ each: true })
  tagsIds: string[];

  @IsString()
  lattesId: string;
}
