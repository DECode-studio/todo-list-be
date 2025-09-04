import { Request, Response } from 'express';
import { LoginRequest, RegisterRequest } from '../model/request/auth';
import { comparePassword, hashPassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const register = async (
    req: Request,
    res: Response
) => {
    try {
        const body: RegisterRequest = req.body;

        if (!body.name || !body.email || !body.password) {
            return res.status(400).json({
                error: 'Name, email, and password are required',
            });
        }

        if (body.password !== body.confirmPassword) {
            return res.status(400).json({
                error: 'Password and confirm password do not match',
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Email already in use',
            });
        }

        const hashedPassword = await hashPassword(body.password);

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
            },
        });

        const token = generateToken(user);

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const body: LoginRequest = req.body;

        if (!body.email || !body.password) {
            return res.status(400).json({
                error: 'Email and password are required',
            });
        }

        const user = await prisma.user.findUnique({
            where: { email: body.email, deleted: false },
        });

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password',
            });
        }

        const isPasswordValid = await comparePassword(body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid email or password',
            });
        }

        const token = generateToken(user);

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user?.id ?? '',
                name: user?.name ?? '',
                email: user?.email ?? '',
                createdAt: user?.createdAt ?? '',
                updatedAt: user?.updatedAt ?? '',
                deleted: user?.deleted ?? '',
            },
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
}