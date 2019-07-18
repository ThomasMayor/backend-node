import { Request, Response, ErrorRequestHandler } from 'express';

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).send({ error: 404 });
};

export const errorMiddleware: ErrorRequestHandler = (err, req: Request, res: Response, next) => {
  res.status(500).send({ error: 500, message: err.message });
};
