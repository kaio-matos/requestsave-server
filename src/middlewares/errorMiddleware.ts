import { NextFunction, Request, Response } from "express";
import { errorHelper } from "../utils/errorHelper";

export default (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | void => {
  const err = errorHelper(error);
  return res.status(err.status).json(err);
};
