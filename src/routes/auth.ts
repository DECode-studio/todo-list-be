import { Router } from "express";
import { login, register } from "../controller/auth";

const router = Router();

const authRoute = '/api/auth'
router.post(`${authRoute}/register`, register);
router.post(`${authRoute}/login`, login);

export default router;