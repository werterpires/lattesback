import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuallisDocument = HydratedDocument<Quallis>;

@Schema({ timestamps: true })
export class Quallis {
  @Prop({ required: true })
  issn: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  stratum: string;
}

export const QuallisSchema = SchemaFactory.createForClass(Quallis);
