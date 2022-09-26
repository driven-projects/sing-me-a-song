import {prisma} from '../database/database';
import {populateRecommendationsWithRandomScores} from "../../tests/factories/recommendationFactory"

export async function truncate() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

export async function populateDatabase(){
 await  populateRecommendationsWithRandomScores(15)
}