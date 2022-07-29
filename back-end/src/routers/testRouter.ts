import { Router } from "express";
import { recommendationController } from "../controllers/recommendationController.js";


const testRouter = Router();

testRouter.post("/reset", recommendationController.reset);

export default testRouter;
