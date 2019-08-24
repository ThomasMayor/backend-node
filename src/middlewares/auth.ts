import { Request, Response } from 'express';
import * as  jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  tokenContent?: { user: any };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next) => {
  const token = req.header('Authorization');

  try {
    const content: any = jwt.verify(token, process.env.JWT_SECRET);
    req.tokenContent = content;
    // token valid & not expired
    next();
  }
  catch (e) {
    // token invalid
    res.status(401).send({ error: 401 });
  }
};
