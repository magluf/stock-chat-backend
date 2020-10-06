import { Schema, model, Document } from 'mongoose';
import { encryptPassword, generateSalt } from '../utils/encrypt.util';

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export interface IUser extends Document {
  username: string;
  email: string;
  password: string | undefined;
  passwordChangedAt?: Date;
  salt: string | undefined;
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: 'Username is required.',
      unique: true,
    },
    email: {
      type: String,
      required: 'Email adress is required.',
      trim: true,
      lowercase: true,
      unique: true,
      match: [emailRegex, 'Email adress is invalid.'],
    },
    password: {
      type: String,
      required: 'Password is required.',
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    salt: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.salt = await generateSalt();
  this.password = await encryptPassword(
    this.password as string,
    this.salt as string,
  );
  next();
});

export default model<IUser>('User', userSchema);
