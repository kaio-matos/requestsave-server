import jwt from "jsonwebtoken";

export function createJWT(_id: string) {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const tokenToVerify = `Bearer ${token}`;
  return tokenToVerify;
}
