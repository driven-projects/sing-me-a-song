import {
  createScenarioWithNAmountAndDistribuitedScore,
  createScenarioWithRecommendationDownVoted,
  deleteAllData,
} from "../factories/scenariosFactory.js"

export const testsService = {
  async resetDatabase() {
    await deleteAllData()
  },

  async seedDatabase(amount: number, highScorePercentage: number) {
    await createScenarioWithNAmountAndDistribuitedScore(
      amount,
      highScorePercentage,
    )
  },

  async seedLowScoreSong(score: number) {
    await createScenarioWithRecommendationDownVoted(score)
  },
}
