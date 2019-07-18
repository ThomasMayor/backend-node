import { Request, Response } from 'express';
import * as  jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next) => {
  const token = req.header('Authorization');

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    // token valid & not expired
    next();
  }
  catch (e) {
    // token invalid
    res.status(401).send({ error: 401 });
  }
};
