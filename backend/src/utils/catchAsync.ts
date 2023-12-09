import { NextFunction, Request, Response, RequestHandler } from "express";

export const catchAsync = (fn: Function): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
