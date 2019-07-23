import * as express from 'express';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

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
  // 1. Validate user data
  // 2. Create Model instance
  // 3. Save and manage validation errors
  // 4. Generate user token
  // 5. Return complete user object with token
};
authRouter.post('/signup', signupHandler);



