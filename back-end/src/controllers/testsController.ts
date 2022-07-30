import { Request, Response } from "express"
import { testsService } from "../services/testsService.js"

export async function resetDatabase(req: Request, res: Response) {
  await testsService.resetDatabase()

  res.send(200)
}
