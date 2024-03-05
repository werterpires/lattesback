import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurriculumDocument = HydratedDocument<Curriculum>;

@Schema({ timestamps: true })
export class Curriculum {
  @Prop({ required: true })
  lattesId: string;
  @Prop({ required: true })
  active: boolean;
  @Prop({ required: false })
  serviceYears: string;
  @Prop({ required: true })
  curriculum: string;
  @Prop({ required: true })
  updatedDate: string;
}

export const CurriculumSchema = SchemaFactory.createForClass(Curriculum);
