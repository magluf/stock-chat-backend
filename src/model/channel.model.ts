import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IChannel extends Document {
  creator?: IUser;
  name: string;
  details: string;
}

export const channelSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: 'Name is required.',
      unique: true,
    },
    details: {
      type: String,
      required: 'Details are required.',
    },
  },
  { timestamps: true },
);

export default model<IChannel>('Channel', channelSchema);
