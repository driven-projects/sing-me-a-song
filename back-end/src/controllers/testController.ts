import { Request, Response } from "express";
import * as testServices from "../services/testService.js"

export async function resetDatabase(req: Request, res: Response){
  await testServices.resetDatabase()
  res.sendStatus(200)
}

