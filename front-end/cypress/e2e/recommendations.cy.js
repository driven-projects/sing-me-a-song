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
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }

    cy.addSong(song)

    cy.visit("http://localhost:3000")
    cy.get("#song-name-input").type(song.name)
    cy.get("#song-url-input").type(song.youtubeLink)
    cy.intercept("POST", "/recommendations").as("createRecommendation")
    cy.get("#submit-song-button").click()
    cy.wait("@createRecommendation").then(({ response }) => {
      cy.log(response)
      expect(response.statusCode).to.equal(409)
    })
  })

  it("should not create a song recommendation with an empty name", () => {
    const song = {
      name: "Test song name",
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }

    cy.visit("http://localhost:3000")
    cy.get("#song-url-input").type(song.youtubeLink)
    cy.intercept("POST", "/recommendations").as("createRecommendation")
    cy.get("#submit-song-button").click()
    cy.wait("@createRecommendation").then(({ response }) => {
      cy.log(response)
      expect(response.statusCode).to.equal(422)
    })
  })

  it("should not create a song recommendation with an empty name", () => {
    const song = {
      name: "Test song name",
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }

    cy.visit("http://localhost:3000")
    cy.get("#song-name-input").type(song.name)
    cy.intercept("POST", "/recommendations").as("createRecommendation")
    cy.get("#submit-song-button").click()
    cy.wait("@createRecommendation").then(({ response }) => {
      cy.log(response)
      expect(response.statusCode).to.equal(422)
    })
  })
})

describe("Home screen test suite", () => {
  // it("should load ten song recommendations", () => {
  //   const amount = 50
  //   const highScorePercentage = 70
  //   cy.seedDatabase(amount, highScorePercentage)

  //   cy.intercept("GET", "/recommendations").as("getRecommendations")
  //   cy.visit("http://localhost:3000")
  //   cy.wait("@getRecommendations").then(({ response }) => {
  //     cy.log(response)
  //     expect(response.body.length).to.equal(10)
  //     expect(response.body[0]).to.haveOwnProperty("name")
  //     expect(response.body[0]).to.haveOwnProperty("youtubeLink")
  //     expect(response.body[0]).to.haveOwnProperty("score")
  //   })
  // })

  // it("should be able to vote up", () => {
  //   const song = {
  //     name: "Test song name",
  //     youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  //   }

  //   cy.addSong(song)

  //   cy.intercept("GET", "/recommendations").as("getRecommendations")
  //   cy.visit("http://localhost:3000")
  //   cy.wait("@getRecommendations")

  //   cy.intercept("POST", `/recommendations/1/upvote`).as("buttonClick")
  //   cy.get("article>div:nth-child(3)").then((div) => {
  //     const voteCountBefore = Number(div.text())
  //     cy.log(voteCountBefore)

  //     cy.get(".vote-up-arrow:first").click()
  //     cy.wait("@buttonClick").then(({ response }) => {
  //       expect(response.statusCode).to.equal(200)
  //       const voteCountAfter = Number(div.text())
  //       cy.wait(500).then(() =>
  //         expect(voteCountAfter).to.equal(voteCountBefore + 1),
  //       )
  //     })
  //   })
  // })

  // it("should be able to vote down", () => {
  //   const song = {
  //     name: "Test song name",
  //     youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  //   }

  //   cy.addSong(song)

  //   cy.intercept("GET", "/recommendations").as("getRecommendations")
  //   cy.visit("http://localhost:3000")
  //   cy.wait("@getRecommendations")

  //   cy.intercept("POST", `/recommendations/1/downvote`).as("buttonClick")
  //   cy.get("article>div:nth-child(3)").then((div) => {
  //     const voteCountBefore = Number(div.text())
  //     cy.log(voteCountBefore)

  //     cy.get(".vote-down-arrow:first").click()
  //     cy.wait("@buttonClick").then(({ response }) => {
  //       expect(response.statusCode).to.equal(200)
  //       const voteCountAfter = Number(div.text())
  //       cy.wait(500).then(() =>
  //         expect(voteCountAfter).to.equal(voteCountBefore - 1),
  //       )
  //     })
  //   })
  // })

  it("should remove the video when down voting a video with -5 score", () => {
    const score = -5
    cy.addLowScoreSong(score)

    cy.visit("http://localhost:3000/")

    cy.intercept("POST", `/recommendations/1/downvote`).as("buttonClick")
    cy.get("article>div:nth-child(3)").then((div) => {
      const voteCountBefore = Number(div.text())
      cy.log(voteCountBefore)

      cy.get(".vote-down-arrow:first").click()
      cy.wait("@buttonClick").then(({ response }) => {
        expect(response.statusCode).to.equal(200)
        const voteCountAfter = Number(div.text())
        cy.wait(500).then(() => {
          cy.get("article>div:nth-child(3)").should("not.exist")
        })
      })
    })
  })
})

describe("Top screen test suit", () => {
  it("should load ten random song recommendations", () => {
    const amount = 50
    const highScorePercentage = 70
    cy.seedDatabase(amount, highScorePercentage)

    cy.intercept("GET", "/recommendations/top/10").as("getTopRecommendations")
    cy.visit("http://localhost:3000/top")
    cy.wait("@getTopRecommendations").then(({ response }) => {
      cy.log(response)
      expect(response.body.length).to.equal(10)
      expect(response.body[0]).to.haveOwnProperty("name")
      expect(response.body[0]).to.haveOwnProperty("youtubeLink")
      expect(response.body[0]).to.haveOwnProperty("score")
      expect(response.body[0].score).to.gte(response.body[9].score)
    })
  })
})

describe("Random screen test suit", () => {
  it("should load ten tests", () => {
    const amount = 50
    const highScorePercentage = 70
    cy.seedDatabase(amount, highScorePercentage)

    cy.intercept("GET", "/recommendations/random").as("getRandomRecommendation")
    cy.visit("http://localhost:3000/random")
    cy.wait("@getRandomRecommendation").then(({ response }) => {
      cy.log(response)
      expect(response.body).to.haveOwnProperty("name")
      expect(response.body).to.haveOwnProperty("youtubeLink")
      expect(response.body).to.haveOwnProperty("score")
    })
  })
})
