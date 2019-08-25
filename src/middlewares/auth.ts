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
    // token is valid & not expired, let's update token expiry so user will
    // not be disconnected during application use :
    //
    // 1. Save original json method
    const originalJson = res.json;
    // 2. replace it with new one
    res.json = (body?: any): Response => {
      // 3. Don't update token for:
      // - Failed requests
      // - Request without token
      // - Responses without body
      // - Auth routes
      if (res.statusCode === 200 && body && token && typeof body === 'object') {
        // 4. generate new token with same payload from current token
        const newToken = jwt.sign(jwt.decode(token), process.env.JWT_SECRET, { expiresIn:  process.env.JWT_EXPIRE});
        // 5. add it to response so frontend can update it
        body.token = newToken;
      }
      // 6. Call origin json method
      return originalJson.call(res, body);
    };
    next();
  }
  catch (e) {
    // token invalid
    res.status(401).send({ error: 401 });
  }
};
