import crypto from "crypto";

export function generateTokenAndExpiration(
  expirationTime: number,
  length: number
) {
  const token = crypto.randomBytes(20).toString("hex").slice(0, length);
  const now = new Date();
  now.setHours(now.getHours() + expirationTime);

  return { token, expiration: now };
}
