import supertest from 'supertest';
import app from '../src/app.js';

describe("POST /recommendations", () => {

  it("should give status 201 with valid body"), async () => {
    const user = await createUser();
    const response = await supertest(app).post("/sign-in").send({ email: user.email, password: user.password });
    expect(response.status).toBe(200);
}
})