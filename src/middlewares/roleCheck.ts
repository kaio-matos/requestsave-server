import { NextFunction, Request, Response } from "express";
import { prisma } from "../app";
import ErrorDealer from "../errors/ErrorDealer";

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = req.body.account_id;
  if (!id) throw new ErrorDealer("User:DontExist");

  const account = await prisma.account.findUnique({ where: { id } });

  if (!account) throw new ErrorDealer("User:DontExist");
  if (account.role !== "ADMIN") throw new ErrorDealer("User:Forbidden");

  next();
};
