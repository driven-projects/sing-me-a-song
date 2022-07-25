import { Recommendation } from "@prisma/client";
import { recommendationRepository } from "../repositories/recommendationRepository.js";
import { conflictError, notFoundError } from "../utils/errorUtils.js";

export type CreateRecommendationData = Omit<Recommendation, "id" | "score">;

async function insert(createRecommendationData: CreateRecommendationData) {
  const existingRecommendation = await recommendationRepository.findByName(
    createRecommendationData.name
  );
  if (existingRecommendation)
    throw conflictError("Recommendations names must be unique");

  await recommendationRepository.create(createRecommendationData);
}

async function upvote(id: number) {
  await getByIdOrFail(id);

  await recommendationRepository.updateScore(id, "increment");
}

async function downvote(id: number) {
  await getByIdOrFail(id);

  const updatedRecommendation = await recommendationRepository.updateScore(
    id,
    "decrement"
  );

  if (updatedRecommendation.score < -5) {
    await recommendationRepository.remove(id);
  }
}

async function getByIdOrFail(id: number) {
  const recommendation = await recommendationRepository.find(id);
  if (!recommendation) throw notFoundError();

  return recommendation;
}

async function get() {
  return recommendationRepository.findAll();
}

async function getTop(amount: number) {
  return recommendationRepository.getAmountByScore(amount);
}

async function getRandom() {
  const random = Math.random();
  const scoreFilter = getScoreFilter(random);

  const recommendations = await getByScore(scoreFilter);
  if (recommendations.length === 0) {
    throw notFoundError();
  }

  const randomIndex = Math.floor(Math.random() * recommendations.length);
  return recommendations[randomIndex];
}

async function getByScore(scoreFilter: "gt" | "lte") {
  const recommendations = await recommendationRepository.findAll({
    score: 10,
    scoreFilter,
  });

  if (recommendations.length > 0) {
    return recommendations;
  }

  return recommendationRepository.findAll();
}

function getScoreFilter(random: number) {
  if (random < 0.7) {
    return "gt";
  }

  return "lte";
}

export const recommendationService = {
  insert,
  upvote,
  downvote,
  getRandom,
  get,
  getById: getByIdOrFail,
  getTop,
};
