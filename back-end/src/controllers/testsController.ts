import { Request, Response } from "express"
import { testsService } from "../services/testsService.js"

export async function resetDatabase(req: Request, res: Response) {
  await testsService.resetDatabase()

  res.sendStatus(200)
}

export async function seedDatabase(req: Request, res: Response) {
  const { amount, highScorePercentage } = req.query

  await testsService.seedDatabase(Number(amount), Number(highScorePercentage))

  res.sendStatus(201)
}

export async function seedLowScoreSong(req: Request, res: Response) {
  const { score } = req.query

  await testsService.seedLowScoreSong(Number(score))

  res.sendStatus(201)
}
