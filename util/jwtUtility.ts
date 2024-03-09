import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

//Generate token
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_KEY!, { expiresIn: "1h" });
};

//Verify token
export const authorize = (req: Request): JwtPayload | false => {
  try {
    const headers = req.headers;
    const token = headers.authorization?.split(" ")[1];

    if (token) {
      const jwtKey = process.env.JWT_KEY!;
      const decoded = jwt.verify(token, jwtKey) as JwtPayload;
      return decoded;
    } else {
      return false;
    }
  } catch (error: any) {
    return false;
  }
};
