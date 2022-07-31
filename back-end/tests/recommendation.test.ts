import supertest from "supertest"
import app from "../src/app"
import { prisma } from "../src/database"
import { recommendationFactory } from "../src/factories/recommendationFactory"
import {
  createScenarioWithNAmountAndDistribuitedScore,
  createScenarioWithNRecommenations,
  createScenarioWithOneRecommendation,
  createScenarioWithRecommendationDownVoted,
  deleteAllData,
} from "../src/factories/scenariosFactory"
import { paths } from "./utils/apiPaths"

const agent = supertest(app)
const createPath = paths.recommendations.create

beforeEach(async () => {
  await deleteAllData()
})

describe("Recommendations -> Create test suite", () => {
  describe("/recommendations", () => {
    it("Given a right recommendation data, it should return 201", async () => {
      const recommendationData = recommendationFactory.createData()
      delete recommendationData.score

      const result = await agent.post(createPath).send(recommendationData)

      const foundCreatedData = await prisma.recommendation.findFirst({
        where: {
          name: recommendationData.name,
          youtubeLink: recommendationData.youtubeLink,
        },
      })

      expect(result.statusCode).toBe(201)
      expect(foundCreatedData).not.toBeNull()
    })

    it("Given a already created recommendation data, it should return 409", async () => {
      const { recommendation } = await createScenarioWithOneRecommendation()

      const result = await agent.post(createPath).send({
        name: recommendation.name,
        youtubeLink: recommendation.youtubeLink,
      })

      expect(result.statusCode).toBe(409)
    })

    it("Given a recommendation data with a empty name, it should return 422", async () => {
      const recommendationData = recommendationFactory.createData()
      const emptyNameData = { ...recommendationData, name: "" }

      const result = await agent.post(createPath).send(emptyNameData)

      expect(result.statusCode).toBe(422)
    })

    it("Given a recommendation data with a not valid URL, it should return 422", async () => {
      const recommendationData = recommendationFactory.createData()
      const wrongYoutubeLink = {
        ...recommendationData,
        youtubeLink: "www.google.com",
      }
      const result = await agent.post(createPath).send(wrongYoutubeLink)

      expect(result.statusCode).toBe(422)
    })
  })
})

describe("Recommendations -> Vote test suite", () => {
  describe("/recommendations/:id/voteup", () => {
    it("Given a valid recommendation id, it should add a vote to it and return 200", async () => {
      const { recommendation } = await createScenarioWithOneRecommendation()

      const result = await agent.post(
        paths.recommendations.upVote(recommendation.id),
      )

      const votedRecommendation = await prisma.recommendation.findFirst({
        where: { id: recommendation.id },
      })

      expect(result.statusCode).toBe(200)
      expect(votedRecommendation.score).toBe(1)
    })

    it("Given a not existing recommendation id, it should not add a vote to it and return 404", async () => {
      const { recommendation } = await createScenarioWithOneRecommendation()

      const result = await agent.post(
        paths.recommendations.upVote(recommendation.id + 1),
      )

      expect(result.statusCode).toBe(404)
    })
  })

  describe("/recommendations/:id/votedown", () => {
    it("Given a valid recommendation id, it should subtract a vote to it and return 200", async () => {
      const { recommendation } = await createScenarioWithOneRecommendation()

      const result = await agent.post(
        paths.recommendations.downVote(recommendation.id),
      )

      const votedRecommendation = await prisma.recommendation.findFirst({
        where: { id: recommendation.id },
      })

      expect(result.statusCode).toBe(200)
      expect(votedRecommendation.score).toBe(-1)
    })

    it("Given a valid recommendation id with a -5 score,it should subtract a vote, erase the recommendation, then return 200", async () => {
      const { recommendation } =
        await createScenarioWithRecommendationDownVoted(-5)

      const result = await agent.post(
        paths.recommendations.downVote(recommendation.id),
      )

      const votedRecommendation = await prisma.recommendation.findFirst({
        where: { id: recommendation.id },
      })

      expect(result.statusCode).toBe(200)
      expect(votedRecommendation).toBeNull()
    })

    it("Given a not existing recommendation id, it should not subtract a vote to it and return 404", async () => {
      const { recommendation } = await createScenarioWithOneRecommendation()

      const result = await agent.post(
        paths.recommendations.downVote(recommendation.id + 1),
      )

      expect(result.statusCode).toBe(404)
    })
  })
})

describe("Recommendations -> Read test suite", () => {
  describe("/recommendations", () => {
    it("It should return a list with 10 recommendations", async () => {
      await createScenarioWithNRecommenations(20)

      const result = await agent.get(paths.recommendations.getTen)

      expect(result.body.length).toBe(10)
      expect(result.body[0]).toHaveProperty("id")
      expect(result.body[0]).toHaveProperty("name")
      expect(result.body[0]).toHaveProperty("youtubeLink")
      expect(result.body[0]).toHaveProperty("score")
    })
  })

  describe("/recommendations/:id", () => {
    it("Given a valid recommendation id, it should return the recommendation object", async () => {
      const { recommendation } = await createScenarioWithOneRecommendation()

      const result = await agent.get(
        paths.recommendations.getById(recommendation.id),
      )

      expect(result.body).toHaveProperty("id")
      expect(result.body).toHaveProperty("name")
      expect(result.body).toHaveProperty("youtubeLink")
      expect(result.body).toHaveProperty("score")
    })

    it("Given a not existing recommendation id, it should return 404", async () => {
      const { recommendation } = await createScenarioWithOneRecommendation()

      const result = await agent.get(
        paths.recommendations.getById(recommendation.id + 1),
      )

      expect(result.statusCode).toBe(404)
    })
  })

  describe("/random", () => {
    it("It should return a random recommendation object", async () => {
      await createScenarioWithNAmountAndDistribuitedScore(10)

      const result = await agent.get(paths.recommendations.getRandom)
      expect(result.body).toHaveProperty("score")
    })

    it("When all registered songs have score greater than 10, it should return one of those songs", async () => {
      await createScenarioWithNAmountAndDistribuitedScore(10, 100)

      const result = await agent.get(paths.recommendations.getRandom)
      expect(result.body.score).toBeGreaterThan(10)
    })

    it("When all registered songs have score lower than 10, it should return one of those songs", async () => {
      await createScenarioWithNAmountAndDistribuitedScore(10, 0)

      const result = await agent.get(paths.recommendations.getRandom)
      expect(result.body.score).toBeLessThanOrEqual(10)
    })

    it("It should return a status code of 404 when no song is registered", async () => {
      await createScenarioWithNRecommenations(0)

      const result = await agent.get(paths.recommendations.getRandom)
      expect(result.statusCode).toBe(404)
    })
  })

  describe("/recommendations/top/:amount", () => {
    it("Given an :amount of 10, it should return a list of the 10 top scored songs", async () => {
      const amount = 10

      await createScenarioWithNAmountAndDistribuitedScore(40, 60)
      const result = await agent.get(paths.recommendations.getTop(amount))

      expect(result.body.length).toBe(amount)
      expect(result.body[0].score).toBeGreaterThanOrEqual(
        result.body[amount - 1].score,
      )
    })
  })
})
