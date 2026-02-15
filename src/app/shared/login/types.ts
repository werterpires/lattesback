import mongoose from 'mongoose';

export interface IUser {
  userId: mongoose.Types.ObjectId | string; // MongoDB: ObjectId, SQL Server: UUID string
  name: string;
  email: string;
  role: string;
}
