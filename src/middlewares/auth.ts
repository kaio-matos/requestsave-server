import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ResMsg } from "../utils/ResponseMessage";

export default (
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | void => {
  const authHeader = req.headers["authorization-token"] as string;
  if (!authHeader)
    return res
      .status(401)
      .json(ResMsg("Por favor faça o login para prosseguir", false));

  const parts = authHeader.split(" ");
  if (parts.length !== 2)
    return res.status(401).json(ResMsg("Erro de token", false));

  // O token possui duas partes que são separadas pelo espaço,            -> ex: "Bearer 5456475sdf65a65sdf..."
  // essa separação foi feita direto nos controllers quando criamos o JWT
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json(ResMsg("Token mal formatado", false));

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json(ResMsg("Token inválido", false));

    req._id = decoded._id;
    return next();
  });
};
