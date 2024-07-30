import mongoose from 'mongoose';

export interface ITag {
  _id: mongoose.Types.ObjectId;
  tagName: string;
}
