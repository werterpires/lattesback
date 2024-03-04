import mongoose from 'mongoose';

export interface IUser {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
}
