import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { TaskStatus } from '@prisma/client';
import { ApiResponse } from '@/model';

const prisma = new PrismaClient()

export const getTasks = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;
        const status = req.query.status as string;

        let whereClause: any = {
            userId,
            deleted: false,
        };

        if (status && status !== TaskStatus.ALL) {
            whereClause.status = status;
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        const response: ApiResponse = {
            status: {
                code: 200,
                message: 'Tasks retrieved successfully'
            },
            data: tasks
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

export const createTask = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;
        const { title, description } = req.body;

        if (!title) {
            const response: ApiResponse = {
                status: {
                    code: 400,
                    message: 'Title is required'
                },
            }
            return res.json(response);
        }

        if (!description) {
            const response: ApiResponse = {
                status: {
                    code: 400,
                    message: 'Description is required'
                },
            }
            return res.json(response);
        }

        const task = await prisma.task.create({
            data: {
                title,
                description: description || '',
                status: TaskStatus.PENDING,
                userId,
            }
        });

        const response: ApiResponse = {
            status: {
                code: 200,
                message: 'Task created successfully',
            },
            data: task,
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

export const updateTaskStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;
        const { id } = req.query;
        const {
            title, description, status
        } = req.body;

        if (!status || !Object.values(TaskStatus).includes(status as any)) {
            return res.status(400).json({ error: 'Invalid or missing status' });
        }

        const task = await prisma.task.findFirst({
            where: {
                id: id.toString(),
                userId,
                deleted: false,
            },
        });

        if (!task) {
            const response: ApiResponse = {
                status: {
                    code: 404,
                    message: 'Task not found or access denied'
                },
            }
            return res.json(response);
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: id.toString()
            },
            data: {
                title, description, status
            }
        });

        const response: ApiResponse = {
            status: {
                code: 200,
                message: 'Task status updated',
            },
            data: updatedTask,
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

export const deleteTask = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;
        const { id } = req.query;

        const task = await prisma.task.findFirst({
            where: {
                id: id.toString(),
                userId,
                deleted: false,
            },
        });

        if (!task) {
            const response: ApiResponse = {
                status: {
                    code: 404,
                    message: 'Task not found or access denied'
                },
            }
            return res.json(response);
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: id.toString()
            },
            data: { deleted: true }
        });

        const response: ApiResponse = {
            status: {
                code: 200,
                message: 'Task deleted',
            },
            data: updatedTask,
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