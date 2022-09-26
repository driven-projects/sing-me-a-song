beforeEach(() => {
  cy.resetDatabase();
  cy.seedDatabase();
})

describe("empty spec", () => {
  it("Retorna as últimas 10 recomendações", async () => {
    cy.visit("http://localhost:3000");
  
    cy.intercept("GET", "/recommendations/top").as("getTopRecommendations");
    cy.get('[data-test-id="top"]').click()
   
    cy.wait("@getTopRecommendations");
  });
});
