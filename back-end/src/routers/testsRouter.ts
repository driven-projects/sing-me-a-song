import { Router } from "express"
import { resetDatabase } from "../controllers/testsController.js"

export const testsRouter = Router()

testsRouter.post("/reset-database", resetDatabase)
