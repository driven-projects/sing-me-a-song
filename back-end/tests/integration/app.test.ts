import app from '../../src/app.js';
import supertest from 'supertest';
import {prisma} from "../../src/database.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(async () => {
    await prisma.$disconnect();
});
