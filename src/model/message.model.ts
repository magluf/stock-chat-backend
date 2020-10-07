import { Schema, model, Document } from 'mongoose';
import { channelSchema, IChannel } from './channel.model';
import { IUser, userSchema } from './user.model';

export interface IMessage extends Document {
  author: IUser;
  channel: IChannel;
  content: string;
}

const messageSchema: Schema = new Schema(
  {
    author: {
      type: userSchema,
      required: true,
    },
    channel: {
      type: channelSchema,
      required: true,
    },
    content: {
      type: String,
      required: 'Content is required',
    },
  },
  { timestamps: true },
);

export default model<IMessage>('Message', messageSchema);
