import { Router } from "express";

import { login, register } from "@/controller/auth";
import { createTask, deleteTask, getTasks, updateTaskStatus } from "@/controller/task";
import { authenticate } from "@/middleware/auth";

const router = Router();

const authRoute = '/api/auth'
router.post(`${authRoute}/register`, register);
router.post(`${authRoute}/login`, login);

const taskRoute = '/api/task'
router.get(`${taskRoute}/get-tasks`, authenticate, getTasks);
router.post(`${taskRoute}/add-task`, authenticate, createTask);
router.patch(`${taskRoute}/edit-task`, authenticate, updateTaskStatus);
router.delete(`${taskRoute}/delete-task`, authenticate, deleteTask);

export default router;