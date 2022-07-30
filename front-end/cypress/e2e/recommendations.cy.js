/// <reference types="cypress" />

import { faker } from "@faker-js/faker"

beforeEach(() => {
  cy.clearDatabase()
})

describe("Recommendations test suite", () => {
  it("should add a song recommendation", () => {
    const song = {
      name: "Test song name",
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }

    cy.visit("http://localhost:3000")
    cy.get("#song-name-input").type(song.name)
    cy.get("#song-url-input").type(song.youtubeLink)
    cy.intercept("POST", "/recommendations").as("createRecommendation")
    cy.get("#submit-song-button").click()
    cy.wait("@createRecommendation")
  })

  it("should not create a duplicated song recommendation", () => {
    const song = {
      name: "Test song name",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }

    cy.addSong(song)

    cy.visit("http://localhost:3000")
    cy.get("#song-name-input").type(song.name)
    cy.get("#song-url-input").type(song.youtubeLink)
    cy.intercept("POST", "/recommendations").as("createRecommendation")
    cy.get("#submit-song-button").click()
    cy.wait("@createRecommendation")
  })
})
