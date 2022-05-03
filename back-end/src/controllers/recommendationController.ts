import { Request, Response } from "express";
import { recommendationSchema } from "../schemas/recommendationsSchemas.js";
import { recommendationService } from "../services/recommendationsService.js";
import { wrongSchemaError } from "../utils/errorUtils.js";

async function insert(req: Request, res: Response) {
  const validation = recommendationSchema.validate(req.body);
  if (validation.error) {
    throw wrongSchemaError();
  }

  await recommendationService.insert(req.body);

  res.sendStatus(201);
}

async function upvote(req: Request, res: Response) {
  const { id } = req.params;

  await recommendationService.upvote(+id);

  res.sendStatus(200);
}

async function downvote(req: Request, res: Response) {
  const { id } = req.params;

  await recommendationService.downvote(+id);

  res.sendStatus(200);
}

async function random(req: Request, res: Response) {
  const randomRecommendation = await recommendationService.getRandom();

  res.send(randomRecommendation);
}

async function get(req: Request, res: Response) {
  const recommendations = await recommendationService.get();
  res.send(recommendations);
}

async function getTop(req: Request, res: Response) {
  const { amount } = req.params;

  const recommendations = await recommendationService.getTop(+amount);
  res.send(recommendations);
}

async function getById(req: Request, res: Response) {
  const { id } = req.params;

  const recommendation = await recommendationService.getById(+id);
  res.send(recommendation);
}

export const recommendationController = {
  insert,
  upvote,
  downvote,
  random,
  getTop,
  get,
  getById,
};
