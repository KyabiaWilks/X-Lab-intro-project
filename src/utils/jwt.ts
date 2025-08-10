import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export const signJwt = (payload: object, options?: jwt.SignOptions) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h', ...options });
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as T;
  } catch (error) {
    return null;
  }
};
