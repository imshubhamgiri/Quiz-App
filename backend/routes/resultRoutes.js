import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { createResult, listResult } from "../controllers/resultController.js";
const resultRouter = express.Router()

resultRouter.post('/', authMiddleware,createResult)
resultRouter.get('/', authMiddleware,listResult)

export default resultRouter;