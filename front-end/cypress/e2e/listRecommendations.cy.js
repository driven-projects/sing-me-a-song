beforeEach(() => {
  cy.resetDatabase();
  cy.seedDatabase();
});

describe("Testa o fluxo de visualização de recomenddações", () => {
  it("Retorna as últimas 10 recomendações", async () => {
    cy.visit("http://localhost:3000");
  });
});
