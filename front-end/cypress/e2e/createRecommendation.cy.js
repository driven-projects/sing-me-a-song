import { faker } from "@faker-js/faker";

describe("Teste para a rota de criação de recomendação", () => {
  it("Cria uma recomendação com dados válidos", () => {
    cy.visit("http://localhost:3000");
    cy.resetDatabase();

    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
    };

    const { name, youtubeLink } = recommendation;

    cy.get('[data-test-id="musicName"]').type(name);
    cy.get('[data-test-id="musicYoutubeLink"]').type(youtubeLink);

    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "postRecommendation"
    );
    cy.get('[data-test-id="submitRecommendation"]').click();
    cy.wait("@postRecommendation");
  });

  it("Adiciona dois pontos à pontuação da recomendação", () => {
    for (let i = 0; i < 2; i++) {
      cy.get('[data-test-id="upvote"]').click();
    }
  });

  it("Remove a recomendação caso a pontuação dela fique abaixo de -5", () => {
    for (let i = 0; i < 8; i++) {
      cy.get('[data-test-id="downvote"]').click();
    }
  });
});
