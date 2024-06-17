import { Request, Response, NextFunction } from "express";

const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: Error) => next(err));
  };
};

export default asyncHandler;
