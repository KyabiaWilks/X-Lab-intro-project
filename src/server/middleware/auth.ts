import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { env } from '~/env';

const SECRET_KEY = process.env.JWT_SECRET_KEY!; // 从环境变量获取密钥

export const authMiddleware = async (req: NextApiRequest) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; userName: string };

      return {
        user: decoded,
      };
    } catch (err) {
      throw new Error('Invalid token');
    }
  } else {
    throw new Error('No token provided');
  }
};
