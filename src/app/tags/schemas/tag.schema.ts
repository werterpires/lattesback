import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true })
  tagName: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
