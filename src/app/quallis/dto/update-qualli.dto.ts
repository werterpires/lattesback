import { PartialType } from '@nestjs/mapped-types';
import { CreateQualliDto } from './create-qualli.dto';

export class UpdateQualliDto extends PartialType(CreateQualliDto) {}
