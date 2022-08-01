import { Request, Response } from "express";
import { e2eTestService } from "../services/e2eTestService.js";

async function reset(req: Request, res: Response) {
    await e2eTestService.reset();    
    res.sendStatus(200);
}

async function populate(req: Request, res: Response) {
    console.log('>>> populate database');
    const {amount} = req.params;
    await e2eTestService.populate(Number(amount));
    res.sendStatus(200);
}


export const testController = {
    populate,
    reset
};

