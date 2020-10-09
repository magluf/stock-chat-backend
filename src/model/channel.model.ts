import { Schema, model, Document } from 'mongoose';

export interface IChannel extends Document {
  name: string;
  details: string;
}

const channelSchema: Schema = new Schema(
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
