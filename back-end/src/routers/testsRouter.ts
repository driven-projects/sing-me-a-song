import { Router } from "express"
import {
  resetDatabase,
  seedDatabase,
  seedLowScoreSong,
} from "../controllers/testsController.js"

export const testsRouter = Router()

testsRouter.post("/reset-database", resetDatabase)
testsRouter.post("/seed-database", seedDatabase)
testsRouter.post("/seed-lowScoreSong", seedLowScoreSong)
