import mongoose from 'mongoose';

export interface ICurriculum {
  _id: mongoose.Types.ObjectId;
  lattesId: string;
  active: boolean;
  serviceYears: string;
  curriculum: string;
  updatedDate: string;
}

export class CreateCurriculum {
  lattesId: string;
  active: boolean;
  serviceYears: string;
  curriculum: string;
  updatedDate: string;
}
