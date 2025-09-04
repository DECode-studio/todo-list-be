import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { TaskStatus } from '@prisma/client';

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

        return res.json({
            message: 'Tasks retrieved successfully',
            data: tasks,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createTask = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.id;
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description: description || '',
                status: TaskStatus.PENDING,
                userId,
            }
        });

        return res.status(201).json({
            message: 'Task created successfully',
            data: task,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateTaskStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !Object.values(TaskStatus).includes(status as any)) {
            return res.status(400).json({ error: 'Invalid or missing status' });
        }

        const task = await prisma.task.findFirst({
            where: {
                id,
                userId,
                deleted: false,
            },
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status }
        });

        return res.json({
            message: 'Task status updated',
            data: updatedTask,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};