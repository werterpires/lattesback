import { IsArrayOfICurriculum } from '../decorators/is-create-curriculum-array.decorator';
import { CreateCurriculum } from '../types';

export class CreateCurriculumDto {
  @IsArrayOfICurriculum({ message: 'Curriculum inválido' })
  curriculums: CreateCurriculum[];
}
