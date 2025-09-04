import { Request, Response } from 'express';
import { LoginRequest, RegisterRequest } from '../model/request/auth';
import { comparePassword, hashPassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/model';

const prisma = new PrismaClient()

export const register = async (
    req: Request,
    res: Response
) => {
    try {
        const body: RegisterRequest = req.body;

        if (!body.name || !body.email || !body.password) {
            const response: ApiResponse = {
                status: {
                    code: 400,
                    message: 'Name, email, and password are required',
                },
            }
            return res.json(response);
        }

        if (body.password !== body.confirmPassword) {
            const response: ApiResponse = {
                status: {
                    code: 400,
                    message: 'Password and confirm password do not match',
                },
            }
            return res.json(response);
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (existingUser) {
            const response: ApiResponse = {
                status: {
                    code: 400,
                    message: 'Email already in use',
                },
            }
            return res.json(response);
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
        const response: ApiResponse = {
            status: {
                code: 200,
                message: 'User registered successfully'
            },
            data: {
                token, user,
            }
        }

        return res.json(response);
    } catch (error: any) {
        const response: ApiResponse = {
            status: {
                code: 400,
                message: `Bad request: ${error}`
            },
        }

        console.error(error);
        return res.json(response);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const body: LoginRequest = req.body;

        if (!body.email || !body.password) {
            const response: ApiResponse = {
                status: {
                    code: 400,
                    message: 'Email and password are required',
                },
            }
            return res.json(response);
        }

        const user = await prisma.user.findUnique({
            where: { email: body.email, deleted: false },
        });

        if (!user) {
            const response: ApiResponse = {
                status: {
                    code: 400,
                    message: 'Invalid email or password',
                },
            }
            return res.json(response);
        }

        const isPasswordValid = await comparePassword(body.password, user.password);
        if (!isPasswordValid) {
            const response: ApiResponse = {
                status: {
                    code: 400,
                    message: 'Invalid email or password',
                },
            }
            return res.json(response);
        }

        const token = generateToken(user);
        const response: ApiResponse = {
            status: {
                code: 200,
                message: 'Login successful',
            },
            data: {
                token, user,
            }
        }

        return res.json(response);
    } catch (error: any) {
        const response: ApiResponse = {
            status: {
                code: 400,
                message: `Bad request: ${error}`
            },
        }

        console.error(error);
        return res.json(response);
    }
}