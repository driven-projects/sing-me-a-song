import app from "../../src/app"
import supertest from "supertest"
import {prisma} from "../../src/database/database"
import {Recommendation} from "@prisma/client"
import {recommendationFactory, populateRecommendationsWithRandomScores} from "../factories/recommendationFactory"
import { recommendationService } from "../../src/services/recommendationsService"

type RecommendationDataType = Recommendation

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
      const {id, score: actualScore} = body[0]

  
      const {status} = await agent.post(`/recommendations/${id}/upvote`)
      const result: RecommendationDataType | null = await prisma.recommendation.findFirst({where:{id}})
      
      if(!result) return
      const scoreWasIncremented = result.score === actualScore+1

      expect(status).toEqual(200)
      expect(scoreWasIncremented).toEqual(true)
   }
   )

   it("Retorna 200 e diminui o número de pontuações em 1", async () => {
      const recommendation = await recommendationFactory()

      await agent.post("/recommendations").send(recommendation)
      const {body} = await agent.get("/recommendations")
      const {id, score: actualScore} = body[0]

      const {status} = await agent.post(`/recommendations/${id}/downvote`)
      const result: RecommendationDataType | null = await prisma.recommendation.findFirst({where:{id}})

      if(!result) return
  
      const scoreWasDecrementend = result.score === actualScore-1
      expect(status).toEqual(200)
      expect(scoreWasDecrementend).toEqual(true)

   })

   it("Retorna 404 caso o id não exista ao aumentar a pontuação da recomendação", async () => {
      const {status} = await agent.post("/recommendations/999/upvote")
      expect(status).toEqual(404)
   })

   it("Retorna 404 caso o id não exista ao diminuir a pontuação da recomendação", async () => {
      const {status} = await agent.post("/recommendations/999/downvote")
      expect(status).toEqual(404)
   })

   it("Exclui a recomendação caso a pontuação fique abaixo de -5", async () => {
      const recommendation = await recommendationFactory()
      

      await agent.post("/recommendations").send(recommendation)
      const {body: recommendationOnDB} = await agent.get("/recommendations")
      const {id} = recommendationOnDB[0]
      await prisma.recommendation.update({where:{id}, data:{score:-5}})

      const {status} = await agent.post(`/recommendations/${id}/downvote`)
      const removedRecommendation = await prisma.recommendation.findFirst({where:{id}})

      expect(status).toEqual(200)
      expect(removedRecommendation).toBeNull()
   })


})

describe("Testa a rota de visualização de recomendações", () => {
   it("Retorna 200 e um array com as últimas 10 recomendações", async () => {
      const recommendation = await recommendationFactory()

      await supertest(app).post("/recommendations").send(recommendation)
      const {status, body: recommendations} = await supertest(app).get("/recommendations")
   
      expect(status).toEqual(200)
      expect(recommendations).toBeInstanceOf(Array)
      expect(recommendations.length).toBeLessThanOrEqual(10)

   })
   
   it("Retorna 200 e a recomendação pelo id ", async () => {
      const recommendation = await recommendationFactory()

      await supertest(app).post("/recommendations").send(recommendation)
      const result:RecommendationDataType | null = await prisma.recommendation.findFirst({where:{name: recommendation.name}})

      if(!result) return
      const {id} = result

      const {status, body: recommendationOnDB} = await supertest(app).get(`/recommendations/${id}`)

      expect(status).toEqual(200)
      expect(recommendationOnDB).toBeInstanceOf(Object)
      
   })

   it("Retorna 404 caso o id da recomendação não exista", async () => {

      const {status} = await supertest(app).get(`/recommendations/999`)

      expect(status).toEqual(404)
   })

   it("Retorna 200 e uma recomendação aleatória com score acima de 10 pontos", async () => {
     await populateRecommendationsWithRandomScores(15)
    
      jest.spyOn(Math, "random").mockImplementationOnce((): any => {
         return 0.5
      })

      const {status, body: recommendationOnDB} = await supertest(app).get("/recommendations/random")

      expect(status).toEqual(200)
      expect(recommendationOnDB).not.toBeNull()
      expect(recommendationOnDB.score).toBeGreaterThan(10)
   })

   it("Retorna 200 e uma recomendação aleatória com score entre -5 e 10 pontos", async () => {
      await populateRecommendationsWithRandomScores(15)
   
      jest.spyOn(Math, "random").mockImplementationOnce((): any => {
         return 0.8
      })

      const {status, body: recommendationOnDB} = await supertest(app).get("/recommendations/random")
      expect(status).toEqual(200)
      expect(recommendationOnDB).not.toBeNull()
      expect(recommendationOnDB.score).toBeGreaterThan(-5)
      expect(recommendationOnDB.score).toBeLessThan(10)
     
      
   })



   it("Retorna 200 e as recomendações ordenadas pelo score em ordem decrescente", async () => {
      const amount = 5
      await populateRecommendationsWithRandomScores(amount)

      const {status, body} = await supertest(app).get(`/recommendations/top/${amount}`)
      const isSorted = isSortedFn(body)

      expect(status).toEqual(200)
      expect(body).toBeInstanceOf(Array)
      expect(body.length).toBeGreaterThanOrEqual(1)
      expect(isSorted).toEqual(true)
   })

   it("Retorna 404 caso não haja nenhuma música cadastrada", async () => {
      const {status} = await supertest(app).get("/recommendations/random")

      expect(status).toEqual(404)
   })
})

function isSortedFn(arr: object[]){
      for (let i = 1; i < arr.length; i++) {
        if(arr[i] > arr[i-1]) {
            return false
        }
      }
      return true
}

afterAll(async () => {
   await prisma.$disconnect()
})