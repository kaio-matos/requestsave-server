import { prisma } from "../app";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorDealer from "../errors/ErrorDealer";
import cookieParser from "cookie-parser";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | void> => {
  if (!process.env.JWT_SECRET) throw new ErrorDealer("Server:Error");

  const authHeader = req.cookies["authorization-token"] as string;
  if (!authHeader) throw new ErrorDealer("User:Unauthorized");

  const parts = authHeader.split(" ");
  if (parts.length !== 2) throw new ErrorDealer("User:TokenBadFormatted");

  // O token possui duas partes que são separadas pelo espaço,            -> ex: "Bearer 5456475sdf65a65sdf..."
  // essa separação foi feita direto nos controllers quando criamos o JWT
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) throw new ErrorDealer("User:TokenBadFormatted");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload === "string" || !payload) throw new ErrorDealer("Server:Error");

    const acc = await prisma.account.findUnique({ where: { id: payload.id } });
    if (!acc) throw new ErrorDealer("User:DontExist");

    req.body.account_id = payload.id;
    return next();
  } catch (err) {
    if (err) throw new ErrorDealer("User:TokenInvalid");
  }
};
