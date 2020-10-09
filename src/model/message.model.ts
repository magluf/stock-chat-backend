import mongoose, { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  authorId: string;
  channelId: string;
  content: string;
  createAt?: string;
  updatedAt?: string;
}

const messageSchema: Schema = new Schema(
  {
    authorId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    channelId: {
      type: mongoose.Types.ObjectId,
      ref: 'Channel',
    },
    content: {
      type: String,
      required: 'Content is required',
    },
  },
  { timestamps: true },
);

export default model<IMessage>('Message', messageSchema);
