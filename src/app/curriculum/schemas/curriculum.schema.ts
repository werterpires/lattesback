import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Tag } from 'src/app/tags/schemas/tag.schema';

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
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }] })
  tags: Tag[];
}

export const CurriculumSchema = SchemaFactory.createForClass(Curriculum);
