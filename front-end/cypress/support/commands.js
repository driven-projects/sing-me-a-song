import { faker } from '@faker-js/faker'

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('resetDatabase', () => {
  cy.request('POST', 'http://localhost:5000/reset-database')
})
Cypress.Commands.add('createRecommendation', () => {
  const data = {
    name: faker.music.genre(),
    youtubeLink: 'https://www.youtube.com/watch?v=NZoRlVi3MjQ&t=105s',
  }
  cy.request('POST', 'http://localhost:5000/recommendations', data)
})
