import app from '../src/app.js';
import supertest from 'supertest';
import { prisma } from "../src/database.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(async () => {
    await prisma.$disconnect();
});


/*

SERVICES FUNCTIONS:

insert (no dependency)
upvote ()
downvote
getRandom
get
getByIdOrFail
getTop

*/


describe("POST /tasks", () => {
    it("given a valid task it should return 201", async () => {
    });
});

