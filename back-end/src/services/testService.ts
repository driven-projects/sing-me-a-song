import { recommendationRepository } from "../repositories/recommendationRepository.js"
import { faker } from '@faker-js/faker';
import { CreateRecommendationData } from "./recommendationsService.js";

export async function resetDatabase(){
    await recommendationRepository.truncate();
}

