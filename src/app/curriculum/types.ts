import mongoose, { Types } from 'mongoose';
import { Tag } from '../tags/schemas/tag.schema';

export interface ICurriculum {
  _id: mongoose.Types.ObjectId | string; // MongoDB: ObjectId, SQL Server: UUID string
  lattesId: string;
  active: boolean;
  serviceYears: string;
  curriculum: string;
  updatedDate: string;
  tags: Tag[] | any[]; // MongoDB: Tag[], SQL Server: TagEntity[]
}

export interface IUpdateCurriculum {
  active: boolean;
  serviceYears: string;
  tags: Types.ObjectId[] | string[]; // MongoDB: ObjectId[], SQL Server: UUID strings
}

export class CreateCurriculum {
  lattesId: string;
  active: boolean;
  serviceYears: string;
  curriculum: string;
  updatedDate: string;
}
