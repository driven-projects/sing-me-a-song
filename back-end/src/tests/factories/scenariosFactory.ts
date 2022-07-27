import { prisma } from "../../database"
import { recommendationFactory } from "./recommendationFactory"

export async function deleteAllData() {
  return prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`,
  ])
}

export async function createScenarioWithOneRecommendation() {
  const recommendationData = recommendationFactory.createData()
  const createdRecommendation = await recommendationFactory.insertData(
    recommendationData,
  )

  return { recommendation: createdRecommendation }
}

export async function createScenarioWithRecommendationDownVoted(
  amount: number,
) {
  const recommendationData = recommendationFactory.createData()
  const createdRecommendation = await recommendationFactory.insertData(
    recommendationData,
  )

  await prisma.recommendation.update({
    where: { id: createdRecommendation.id },
    data: {
      score: { decrement: amount },
    },
  })

  return { recommendation: createdRecommendation }
}
