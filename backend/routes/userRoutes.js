import express from 'express';
import * as userController from '../controllers/userController.js';

const userRouter = express.Router();

// Public routes (no auth required)
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);

export default userRouter;
