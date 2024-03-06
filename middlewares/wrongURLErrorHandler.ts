import { Request, Response, NextFunction } from "express";

const wrongURLErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { stack, message } = err;
  const status = err.status ? err.status : "failed";
  const statusCode = err.statusCode ? err.statusCode : 500;

  res.status(statusCode).json({ message, stack, status });
};

export default wrongURLErrorHandler;
