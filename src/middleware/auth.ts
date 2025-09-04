import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/model';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const prisma = new PrismaClient()
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response: ApiResponse = {
            status: {
                code: 401,
                message: 'Access denied. No token provided.'
            },
        }
        return res.json(response);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id, deleted: false },
        });

        if (!user) {
            const response: ApiResponse = {
                status: {
                    code: 401,
                    message: 'Invalid token or user not found.'
                },
            }
            return res.json(response);
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};