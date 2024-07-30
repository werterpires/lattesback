import mongoose, { Types } from 'mongoose';
import { Tag } from '../tags/schemas/tag.schema';

export interface ICurriculum {
  _id: mongoose.Types.ObjectId;
  lattesId: string;
  active: boolean;
  serviceYears: string;
  curriculum: string;
  updatedDate: string;
  tags: Tag[];
}

export interface IUpdateCurriculum {
  active: boolean;
  serviceYears: string;
  tags: Types.ObjectId[];
}

export class CreateCurriculum {
  lattesId: string;
  active: boolean;
  serviceYears: string;
  curriculum: string;
  updatedDate: string;
}
