import { faker } from "@faker-js/faker"
import { Recommendation } from "@prisma/client"

import { prisma } from "../../src/database"

type FactoryRecommendationData = Omit<Recommendation, "id">

export const recommendationFactory = {
  createData(
    name = "Test name",
    youtubeLink = "https://youtu.be/d8zXQA5Za9M",
    score = 0,
  ): FactoryRecommendationData {
    return {
      name,
      youtubeLink,
      score,
    }
  },
  createRandomData(score = 0): FactoryRecommendationData {
    const youtubeUrl = `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
      10,
    )}`
    return {
      name: faker.random.alphaNumeric(10),
      youtubeLink: youtubeUrl,
      score,
    }
  },

  insertData(data: FactoryRecommendationData) {
    return prisma.recommendation.create({ data })
  },
}
