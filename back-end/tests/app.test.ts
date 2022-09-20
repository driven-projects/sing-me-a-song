import app from "../src/app"
import supertest from "supertest"
import {prisma} from "../src/database"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`
})

const agent = supertest(app)

describe("Testa a rota criação de recomendações", () => {
   


})