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

Cypress.Commands.add("clearDatabase", () => {
  cy.request("POST", "http://localhost:5000/tests/reset-database").then((res) =>
    cy.log(res),
  )
})

Cypress.Commands.add("seedDatabase", (amount, highScorePercentage) => {
  cy.request(
    "POST",
    `http://localhost:5000/tests/seed-database?amount=${amount}&highScorePercentage=${highScorePercentage}`,
  ).then((res) => cy.log(res))
})

Cypress.Commands.add("addSong", (songData) => {
  cy.request("POST", "http://localhost:5000/recommendations", songData).then(
    (res) => cy.log(res),
  )
})

Cypress.Commands.add("addLowScoreSong", (score) => {
  cy.request(
    "POST",
    `http://localhost:5000/tests/seed-lowScoreSong?score=${score}`,
  ).then((res) => cy.log(res))
})
