import jwt from "jsonwebtoken";
import ErrorDealer from "../errors/ErrorDealer";

export function createJWT(id: number) {
  if (!process.env.JWT_SECRET) throw new ErrorDealer("Server:Error");
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const tokenToVerify = `Bearer ${token}`;
  return tokenToVerify;
}
