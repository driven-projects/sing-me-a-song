import { Router } from "express";
import { testController } from "../controllers/e2eTestController.js";




const testRouter = Router();

testRouter.post("/reset", testController.reset);
testRouter.post("/populate/:amount", testController.populate);

export default testRouter;
