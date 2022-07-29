/// <reference types="cypress" />

const url = "http://localhost:3000/";

beforeEach(() => {
    cy.resetDatabase();
});

describe("Login", () => {
    it("should add a song", () => {

        const recommendation = {
            name: "Tudo Nosso",
            youtubeUrl: "https://www.youtube.com/watch?v=7xz7zT9Siek"
        }
        const idName = recommendation.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

        cy.intercept("POST", "/recommendations").as("postRecommendation");

        cy.visit(url);
        cy.get("#new-name").type(recommendation.name);
        cy.get("#new-youtubeUrl").type(recommendation.youtubeUrl);
        cy.get("#new-createButton").click();
        cy.wait("@postRecommendation");
        cy.get(`#${idName}`).should("exist");
    });
});