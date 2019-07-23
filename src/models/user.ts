import {
  Schema,
  Model,
  Document,
  model as mongooseModel
} from 'mongoose';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// main interface
export interface IUser {
  email: string;
  password: string;
  language: string;
  fullname: string;
  avatar: string;
}

// document interface, define custom methods here
export interface IUserDoc extends Document, IUser {
  comparePassword(password: string): boolean;
  getToken(): string;
}

// model interface, define custom static methods here
interface IUserModel extends Model<IUserDoc> {
  hashPassword(password: string): string;
}

// scheam definition
const userSchema = new Schema<IUserDoc>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://www.gravatar.com/avatar/default'
  }
});
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ email: 'hashed' });

// Model custom methods
//
// this is an instance IMovieDoc
//
// allow to do:
// const movie = new MovieModel({...});
// movie.setLanguage('Français');
userSchema.method('comparePassword', function (this: IUserDoc, password: string) {
  try {
    return bcrypt.compareSync(password, this.password);
  }
  catch (e) { }
  return false;
});


userSchema.method('getToken', function (this: IUserDoc) {
  return jwt.sign({
      userId: this._id.toString()
    },
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
});

// Model custom static methods
//
// cannot use this here
//
// allow to do:
// MovieModel.staticMethod();
userSchema.static('hashPassword', (password: string): string => {
  return bcrypt.hashSync(password, +process.env.BCRYPT_ROUNDS);
});


// model generation
export const UserModel = mongooseModel<IUserDoc, IUserModel>('users', userSchema);
