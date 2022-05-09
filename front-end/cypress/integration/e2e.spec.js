/// <reference types="cypress" />

describe('recommendation e2e', () => {
  before(() => {
    cy.resetDatabase()
  })
  it('should create a new recommendation and list it', () => {
    cy.intercept('GET', '/recommendations').as('getRecommendations')
    cy.intercept('POST', '/recommendations').as('postRecommendation')
    cy.visit('http://localhost:3000')
    cy.get('input[type=text]').type('final countdown')
    cy.get('input[type=text]')
      .type('https://www.youtube.com/watch?v=9jK-NcRmVcw')
      .should('have value', 'https://www.youtube.com/watch?v=9jK-NcRmVcw')
    cy.get('#send').click()
    cy.wait('@postRecommendation')
    cy.wait('@getRecommendations')
    cy.get('article').should(($article) => {
      expect($article).to.have.length(1)
    })
    cy.url().should('equal', 'http://localhost:3000/')
  })

  it('should ')
})
