import app from '../../src/app.js';
import supertest from 'supertest';
import {prisma} from "../../src/database.js";
import recommendationsFactory from '../factories/recomendations.factory.js';

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Recommendations Router', () => {

    describe('POST recommendations/', ()=>{

        const recommendation1 = recommendationsFactory.createRecommendationBody();

        it('should return 201 created when a body is valid', async () => {
            const response = await supertest(app)
                .post('/recommendations')
                .send(recommendation1);
            expect(response.status).toBe(201);
        });

        it('should return 422 bad request when name is empty', async () => {
            const recommendation = recommendationsFactory.createRecommendationBody();
            recommendation.name = '';
            const response = await supertest(app)
                .post('/recommendations')
                .send(recommendation);
            expect(response.status).toBe(422);
        });

        it('should return 422 bad request when name is empty', async () => {
            const recommendation = await recommendationsFactory.saveNewRecommendation(0);
            const {name, youtubeLink} = recommendation;
            const response = await supertest(app)
                .post('/recommendations')
                .send({name, youtubeLink});
            expect(response.status).toBe(409);
        });

    })

    describe('GET recommendations/', ()=>{

        it('should return 200 and a list of recommendations', async () => {
            await recommendationsFactory.saveRecommendationList(12);
            const response = await supertest(app)
                .get('/recommendations');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(10);
        });

    })

    describe('GET recommendations/random', ()=>{

        it('should return 200 and a random recommendation', async () => {
            await recommendationsFactory.saveRecommendationList(5);
            const response = await supertest(app)
                .get('/recommendations/random');
            expect(response.status).toBe(200);
            expect(response.body.name).toBeDefined();
            expect(response.body.youtubeLink).toBeDefined();
        });

        it('should return 404 if there is no recommendation', async () => {
            const response = await supertest(app)
                .get('/recommendations/random');
            expect(response.status).toBe(404);
        });
        
    })

    describe('GET recommendations/top/:amount', ()=>{
        
        it('should return 200 and a list with the amount of top recommendations (or all if amount > all)', async () => {
            await recommendationsFactory.saveRecommendationList(10);
            const response = await supertest(app)
                .get('/recommendations/top/5');
            expect(response.status).toBe(200);
            expect(response.body.length).not.toBe(0);
        })

        it('should return 200 and empty when tere is no recommendations', async () => {
            const response = await supertest(app)
                .get('/recommendations/top/5');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });

    })
    
    describe('GET recommendations/:id', ()=>{

        it('should return 200 and a recommendation', async () => {
            const recommendation = await recommendationsFactory.saveNewRecommendation(0);
            const {id} = recommendation;
            const response = await supertest(app)
                .get(`/recommendations/${id}`);
            expect(response.status).toBe(200);
            expect(response.body.name).toBe(recommendation.name);
            expect(response.body.youtubeLink).toBe(recommendation.youtubeLink);
        });

        it('should return 404 not found when there is no recommendation with the id', async () => {
            const response = await supertest(app)
                .get('/recommendations/1');
            expect(response.status).toBe(404);
        });

    })

    describe('POST recommendations/:id/upvote', ()=>{

        it('should return 200 and the recommendation with the upvote', async () => {
            const recommendation = await recommendationsFactory.saveNewRecommendation(0);
            const {id} = recommendation;
            const response = await supertest(app)
                .post(`/recommendations/${id}/upvote`);
            expect(response.status).toBe(200);
            const retrieved = await recommendationsFactory.getRecommendationById(id);
            expect(retrieved.score).toBe(1);
        });

        it('should return 404 not found when there is no recommendation with the id', async () => {
            const response = await supertest(app)
                .post('/recommendations/1/upvote');
            expect(response.status).toBe(404);
        });
    })

    describe('POST recommendations/:id/downvote', ()=>{

        it('should return 200 and the recommendation with the downvote', async () => {
            const recommendation = await recommendationsFactory.saveNewRecommendation(0);
            const {id} = recommendation;
            const response = await supertest(app)
                .post(`/recommendations/${id}/downvote`);
            expect(response.status).toBe(200);
            const retrieved = await recommendationsFactory.getRecommendationById(id);
            expect(retrieved.score).toBe(-1);
        });

        it('should return 200 and delete the recommendation when score < -5', async () => {
            const recommendation = await recommendationsFactory.saveNewRecommendation(-5);
            const {id} = recommendation;
            const response = await supertest(app)
                .post(`/recommendations/${id}/downvote`);
            expect(response.status).toBe(200);
            const retrieved = await recommendationsFactory.getRecommendationById(id);
            expect(retrieved).toBe(null);
        });

        it('should return 404 not found when there is no recommendation with the id', async () => {
            const response = await supertest(app)
                .post('/recommendations/1/downvote');
            expect(response.status).toBe(404);
        });

    })

})