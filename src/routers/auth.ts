import * as express from 'express';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserModel, IUserDoc } from '../models/user';

export const authRouter = express.Router();

const signinHandler = (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log(`signinHandler ${username} ${password}`);

  // validation logic
  // -> bcrypt & mongo
  const valid = true;

  if (valid) {
    const token = jwt.sign({ user: { username } }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.send({ token });
  }
  else {
    res.status(401).send({ error: true, message: 'Username or password incorrect' });
  }
};

authRouter.post('/signin', signinHandler);

const signupHandler = (req: Request, res: Response) => {
  // 1. Validate missing user data from req.body
  const { email, password, language, fullname } = req.body;
  if (!email || !password || !language || !fullname)
    return res.status(400).send({ error: true, message: 'All fields are required' });

  // 2. Validate uniqueness of email
  UserModel
    .findOne({ email })
    .then(user => {
      if (user) {
        res.status(400).send({ error: true, message: 'User already exists'});
        return;
      }
      // 3. Create Model instance using req. body
      const newUser = new UserModel(req.body);
      // 4. Save and manage validation errors
      return newUser.save();
    })
    .then(user => {
      // 5. Generate user token
      const token = user.getToken();
      // 6. Return complete user object with token
      res.send({ user, error: false, token });
    })
    .catch(err => res.status(500).send({ error: true, message: 'Internal server error', err }));
};
authRouter.post('/signup', signupHandler);



