import { Schema, model, Document } from 'mongoose';
import { IUser, userSchema } from './user.model';

export interface IChannel extends Document {
  creator: IUser;
  name: string;
  details: string;
}

const channelSchema: Schema = new Schema(
  {
    creator: {
      type: userSchema,
      required: true,
    },
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
