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
  const createdRecommendation = await recommendationFactory.insertData({
    ...recommendationData,
    score: amount,
  })

  return { recommendation: createdRecommendation }
}

export async function createScenarioWithNRecommenations(amount: number) {
  const recommendationDataArray = []

  for (let i = 0; i < amount; i++) {
    const recommendationData = recommendationFactory.createRandomData()
    recommendationDataArray.push(recommendationData)
  }

  await prisma.recommendation.createMany({ data: recommendationDataArray })
}

export async function createScenarioWithNAmountAndDistribuitedScore(
  amount: number,
  highScorePercentage = 70,
) {
  function getScore(minScore: number, maxScore: number) {
    return Math.floor(Math.random() * (maxScore - minScore) + minScore)
  }
  const highScoreAmount = Math.round(amount * (highScorePercentage / 100))
  const lowScoreAmount = amount - highScoreAmount

  const recommendationDataArray = []

  function createMultipleData(
    amount: number,
    minScore: number,
    maxScore: number,
    array,
  ) {
    for (let i = 0; i < amount; i++) {
      const score = getScore(minScore, maxScore)
      const recommendationData = recommendationFactory.createRandomData(score)

      array.push(recommendationData)
    }
  }

  createMultipleData(highScoreAmount, 11, 100, recommendationDataArray)
  createMultipleData(lowScoreAmount, -5, 10, recommendationDataArray)

  await prisma.recommendation.createMany({ data: recommendationDataArray })
}
