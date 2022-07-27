import path from "path"
import supertest from "supertest"
import app from "../app"
import { prisma } from "../database"
import { recommendationFactory } from "./factories/recommendationFactory"
import {
  createScenarioWithOneRecommendation,
  createScenarioWithRecommendationDownVoted,
  deleteAllData,
} from "./factories/scenariosFactory"
import { paths } from "./utils/apiPaths"

const agent = supertest(app)
const createPath = paths.recommendations.create

beforeEach(async () => {
  await deleteAllData()
})

describe("Recommendations -> Create test suite", () => {
  it("Given a right recommendation data, it should return 201", async () => {
    const recommendationData = recommendationFactory.createData()

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

describe("Recommendations -> Voting test suite", () => {
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
    const { recommendation } = await createScenarioWithRecommendationDownVoted(
      5,
    )

    const result = await agent.post(
      paths.recommendations.downVote(recommendation.id),
    )

    const votedRecommendation = await prisma.recommendation.findFirst({
      where: { id: recommendation.id },
    })

    expect(result.statusCode).toBe(200)
    expect(votedRecommendation).toBeNull()
  })

  it("Given a not existing recommendation id, it should not add a vote to it and return 404", async () => {
    const { recommendation } = await createScenarioWithOneRecommendation()

    const result = await agent.post(
      paths.recommendations.upVote(recommendation.id + 1),
    )

    expect(result.statusCode).toBe(404)
  })

  it("Given a not existing recommendation id, it should not subtract a vote to it and return 404", async () => {
    const { recommendation } = await createScenarioWithOneRecommendation()

    const result = await agent.post(
      paths.recommendations.downVote(recommendation.id + 1),
    )

    expect(result.statusCode).toBe(404)
  })
})
