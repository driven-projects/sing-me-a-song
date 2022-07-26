import supertest from "supertest";
import app from "../../src/app";
import { RecommendationFactory } from "../factories/recommentation.factory";
import { Recommendation } from "@prisma/client";

const agent = supertest(app);

describe("Recommendations routes integration tests", () => {
  const factory = new RecommendationFactory();
  const BASE_URL = "/recommendations";

  describe(`POST ${BASE_URL}`, () => {
    it("Should return 422 if youtubeLink is invalid", async () => {
      const response = await agent
        .post(`${BASE_URL}`)
        .send(factory.newMockRecommendation({ wrongLink: true }));

      expect(response.statusCode).toBe(422);
    });

    it("Should return 409 if recommendation with same name already exists", async () => {
      const mockRecommendation = factory.registerNewRecommendation();
      const response = await agent.post(`${BASE_URL}`).send(mockRecommendation);

      expect(response.statusCode).toBe(409);
    });

    it("Should return 201 in success", async () => {
      const response = await agent
        .post(`${BASE_URL}`)
        .send(factory.newMockRecommendation());

      expect(response.statusCode).toBe(201);
    });
  });

  describe(`GET ${BASE_URL}`, () => {
    it("Should return 200 with recommentations array", async () => {
      const response = await agent.get(`${BASE_URL}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf<Recommendation[]>;
    });
  });

  describe(`GET ${BASE_URL}/random`, () => {
    it("Should return 200 with random Recommedation", async () => {
      const response = await agent.get(`${BASE_URL}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf<Recommendation>;
    });
  });

  describe(`GET ${BASE_URL}/top/:amount`, () => {
    it("Should return 200 with :amount recommendations array", async () => {
      const amount = factory.randomNumber(2);
      const response = await agent.get(`${BASE_URL}/top/${amount}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf<Recommendation[]>;
      expect(response.body.length).toBeLessThanOrEqual(+amount);
    });
  });

  describe(`GET ${BASE_URL}/:id`, () => {
    it("Should return 200 with Recommendation in body ", async () => {
      const { id } = await factory.registerNewRecommendation();
      const response = await agent.get(`${BASE_URL}/${id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf<Recommendation>;
      expect(response.body.id).toBe(id);
    });

    it("Should return 404 with Recommendation is not found", async () => {
      const id = factory.randomNumber(20);
      const response = await agent.get(`${BASE_URL}/${id}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe(`POST ${BASE_URL}/:id/upvote`, () => {
    it("Should return 200 in success", async () => {
      const { id } = await factory.registerNewRecommendation();
      const response = await agent.post(`${BASE_URL}/${id}/upvote`);

      expect(response.statusCode).toBe(200);
    });

    it("Should return 404 with Recommendation is not found", async () => {
      const id = factory.randomNumber(20);
      const response = await agent.post(`${BASE_URL}/${id}/upvote`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe(`POST ${BASE_URL}/:id/downvote`, () => {
    it("Should return 200 in success", async () => {
      const { id } = await factory.registerNewRecommendation();
      const response = await agent.post(`${BASE_URL}/${id}/downvote`);

      expect(response.statusCode).toBe(200);
    });

    it("Should return 404 with Recommendation if not found", async () => {
      const id = factory.randomNumber(20);
      const response = await agent.post(`${BASE_URL}/${id}/downvote`);

      expect(response.statusCode).toBe(404);
    });
  });
});
