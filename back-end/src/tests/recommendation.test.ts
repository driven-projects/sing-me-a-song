import supertest from "supertest"
import app from "../app"
import { prisma } from "../database"
import { recommendationFactory } from "./factories/recommendationFactory"

const agent = supertest(app)

beforeEach(() => {
  prisma.$transaction([prisma.$executeRaw`TRUNCATE TABLE recommendations`])
})

describe("Recommendations -> Create test suite", () => {
  it("Given a right recommendation data, it should return 201", async () => {
    const recommendationData = recommendationFactory.createData()

    const result = await agent.post("/recommendations").send(recommendationData)

    expect(result.statusCode).toBe(201)
  })

  it("Given a already created recommendation data, it should return 409", async () => {
    const recommendationData = recommendationFactory.createData()
    const originalCreatedData = await recommendationFactory.isertData(
      recommendationData,
    )
    console.log(
      `🚀 -> file: recommendation.test.ts -> line 24 -> it -> originalCreatedData`,
      originalCreatedData,
    )

    const result = await agent.post("/recommendations").send(recommendationData)

    expect(result.statusCode).toBe(409)
  })
})
