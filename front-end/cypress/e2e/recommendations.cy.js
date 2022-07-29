/// <reference types="cypress" />

import { faker } from "@faker-js/faker"

describe("Recommendations test suite", () => {
  it("should add a song recommendation", () => {
    cy.visit("http://localhost:3000")
  })
})
