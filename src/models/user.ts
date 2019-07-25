import {
  Schema,
  Model,
  Document,
  model as mongooseModel
} from 'mongoose';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


// Schema property alidators
export const validateAvatar = (avatar: string): boolean => {
  return avatar.startsWith('http://') || avatar.startsWith('https://');
};

// Schema property setters
export const setLuckyNumber = (value: number): number => {
  return Math.floor(Math.abs(value));
};


// main interface
export interface IUser {
  email: string;
  password: string;
  language: string;
  fullname: string;
  avatar: string;
  luckyNumber: number;
  homeLocation: {
    lat: Number,
    long: Number
  };
  journeys: string[];
  lastLogin: number;
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

// schema definition
const userSchema = new Schema<IUserDoc>({
  email: {
    type: String,
    required: true,
    match: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim
  },
  password: {
    type: String,
    required: true,
    minLength: 59,
    maxLength: 60,
  },
  language: {
    type: String,
    required: true,
    enum: ['fr', 'ge', 'en', 'it']
  },
  fullname: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://www.gravatar.com/avatar/default',
    validate: [validateAvatar, 'Avatar must an uri']
  },
  luckyNumber: {
    type: Number,
    required: true,
    default: 7,
    set: setLuckyNumber
  },
  homeLocation: {
    type: {
      lat: {
        type: Number,
        required: true,
      },
      long: {
        type: Number,
        required: true
      }
    },
    required: true,
    default: { lat: 0, long: 0 }
  },
  journeys: {
    type: [String], // !!! <-- array type definition - String[] wont compile
    required: true,
    default: []
  },
  lastLogin: {
    type: Number,
    required: true,
    default: Date.now // !!!! !== of Date.now(), Date.now() give to value once at execution time
                      // With Date.now, we assign a function, which will be callede each time we
                      // need the default value
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

// override toJSON to remove password before sending response
userSchema.method('toJSON', function (this: IUserDoc) {
  const obj = this.toObject();
  delete obj.password;
  return obj;
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
