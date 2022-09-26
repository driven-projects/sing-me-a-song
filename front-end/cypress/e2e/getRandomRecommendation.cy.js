beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa o fluxo de visualização de recomendações aleatórias", () => {
  it("Retorna uma música aleatória", async () => {
    cy.visit("http://localhost:3000");
    cy.seedDatabase();
    
    cy.intercept("GET", "/recommendations/random").as(
      "getRandomRecommendation"
    );

    cy.get('[data-test-id="random"]').click();
    cy.wait("@getRandomRecommendation");
  });
});
