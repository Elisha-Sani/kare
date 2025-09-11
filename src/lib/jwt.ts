import jwt, { SignOptions, Secret } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export interface JwtPayload {
  adminId: number;
}

// Sign JWT
export const signJwt = (
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "1h"
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, SECRET as Secret, options);
};

// Verify JWT
export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};
