import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorDealer from "../errors/ErrorDealer";

export default (
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | void => {
  if (!process.env.JWT_SECRET) throw new ErrorDealer("Server:Error");

  const authHeader = req.headers["authorization-token"] as string;
  if (!authHeader) throw new ErrorDealer("User:Unauthorized");

  const parts = authHeader.split(" ");
  if (parts.length !== 2) throw new ErrorDealer("User:TokenBadFormatted");

  // O token possui duas partes que são separadas pelo espaço,            -> ex: "Bearer 5456475sdf65a65sdf..."
  // essa separação foi feita direto nos controllers quando criamos o JWT
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) throw new ErrorDealer("User:TokenBadFormatted");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) throw new ErrorDealer("User:TokenInvalid");

    if (typeof decoded === "string" || !decoded) throw new ErrorDealer("Server:Error");
    req.body.account_id = decoded.account_id;
    return next();
  });
};
