import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status && err.status >= 400 && err.status < 500 ? err.status : 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Internal server error' : err.message || 'Request failed'
  });
};

export default errorHandler;
