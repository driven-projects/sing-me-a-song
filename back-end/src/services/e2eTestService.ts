import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";
import { recommendationRepository } from "../repositories/recommendationRepository.js";
import { conflictError, notFoundError } from "../utils/errorUtils.js";

export type CreateRecommendationData = Omit<Recommendation, "id" | "score">;


async function reset() {
  await recommendationRepository.reset();
}

async function populate (amount: number) {
  
  const createRecommendations = [];

  let aux = 0;
  for (let i = 0; i < amount; i++) {
    const random = Math.random();
    const score = aux === 0 ? -5 * random : (
      aux === 1 ? 10 * random : 10 * random + 10
    );

    createRecommendations.push({
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      score: Math.round(score)
    });

    if (aux === 2) {aux = 0;}
    else {aux++;}
  }

  await recommendationRepository.populate(createRecommendations);

}

export const e2eTestService = {
  populate,
  reset
};
