import { User } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '24h';

export const generateToken = (user: User): string => {
    const payload = { id: user.id, email: user.email };

    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN as any,
    };

    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): { id: string; email: string } => {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
};