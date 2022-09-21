import app from "../src/app"
import supertest from "supertest"
import {prisma} from "../src/database"
import recommendationFactory from "./factories/recommendationFactory"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`
})

const agent = supertest(app)

describe("Testa a rota criação de recomendações", () => {
   it("Retorna 201 caso os dados de criação sejam válidos", async () => {
        const recommendation = await recommendationFactory()

        const {status} = await supertest(app).post("/recommendations").send(recommendation)
        expect(status).toEqual(201)
   })

   it("Retorna 409 caso crie recomendações com o mesmo nome", async () => {
      const recommendation = await recommendationFactory()
  
      const {status} = await agent.post("/recommendations").send(recommendation)
      expect(status).toEqual(201)

      const result = await agent.post("/recommendations").send(recommendation)
      expect(result.status).toEqual(409)
   })

   it("Retorna 422 caso o link do youtube seja inválido", async () => {
    const recommendation = {name:"Michael Jackson - Bad", youtubeLink:"invalidUrl"}

    const {status} = await agent.post("/recommendations").send(recommendation)
    expect(status).toEqual(422)

   })
})

describe("Testa as rotas de adicionar e remover pontuações das recomendações",  () => {
   it("Retorna 200 e aumenta o número de pontuações em 1", async () => {
     const recommendation = await recommendationFactory()

      await supertest(app).post("/recommendations").send(recommendation)
      const {body} = await agent.get("/recommendations")
      const {id} = body[0]

      await agent.post(`recommendations/${id}/upvote`)
      const recommendationOnDB = await prisma.recommendation.findFirst({where:{id}})

     

     
   })
})