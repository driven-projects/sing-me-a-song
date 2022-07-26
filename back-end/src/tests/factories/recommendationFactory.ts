import { prisma } from "../../database"
import { CreateRecommendationData } from "../../services/recommendationsService"

export const recommendationFactory = {
  createData(
    name = "Test name",
    youtubeLink = "https://youtu.be/d8zXQA5Za9M",
  ): CreateRecommendationData {
    return {
      name,
      youtubeLink,
    }
  },

  isertData(data: CreateRecommendationData) {
    return prisma.recommendation.create({ data })
  },
}
