import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../interfaces/interfaces';

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.status) {
    console.error(err.stack)
    res.status(err.status).json({ msg: err.message });
  } else {
    res.status(500).json({ msg: err.message });
  }
};

export default errorHandler;
