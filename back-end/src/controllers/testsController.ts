import {Request, Response} from "express"
import * as testService from "../services/testsService"

export async function resetDatabase(req: Request, res:Response){
    await testService.truncate()
    
    res.sendStatus(200)
}

export async function populateDatabase(req: Request, res:Response){
    await testService.populateDatabase()

    res.sendStatus(200)
}