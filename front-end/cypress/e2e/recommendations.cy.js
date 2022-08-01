/// <reference types="cypress" />

// import cypress from "cypress";
import recommendationsFactory from "../factories/recomendations.factory.js";

const url = "http://localhost:3000/";

describe("Recommendations", () => {

    describe("Add Recommendation", () => {

        beforeEach(() => {
            cy.resetDatabase();
        });

        const recommendation = recommendationsFactory.createRecommendationBody();

        it("should add a song, if body is valid", () => {
            const idName = `recommendation-0`;
            cy.intercept("POST", "http://localhost:5000/recommendations").as("postRecommendation");
            cy.visit(url);
            cy.get("#new-name").type(recommendation.name);
            cy.get("#new-youtubeUrl").type(recommendation.youtubeUrl);
            cy.get("#new-createButton").click();
            // cy.wait('@postRecommendation');
            cy.wait('@postRecommendation').its('response.statusCode').should('eq', 201);
            cy.get(`#${idName}`).should("exist");
        });

        it("should not add a song, if body is empty", () => {
            cy.intercept("POST", "http://localhost:5000/recommendations").as("postRecommendation");
            cy.visit(url);
            cy.get("#new-createButton").click();
            cy.wait("@postRecommendation").its('response.statusCode').should('eq', 422);
            cy.on('window:alert', () => {
                expect(true).to.be.true;
            });
        });

        it("should not add a song, if link is invalid", () => {
            cy.intercept("POST", "http://localhost:5000/recommendations").as("postRecommendation");
            cy.visit(url);
            cy.get("#new-name").type("Hello");
            cy.get("#new-youtubeUrl").type("54");
            cy.get("#new-createButton").click();
            cy.wait("@postRecommendation").its('response.statusCode').should('eq', 422);
            cy.on('window:alert', () => {
                expect(true).to.be.true;
            });
        });

        it("should not add a song, if name is already in use", () => {
            cy.request('POST', "http://localhost:5000/recommendations", {
                name: recommendation.name,
                youtubeLink: recommendation.youtubeUrl
            });
            cy.intercept("POST", "http://localhost:5000/recommendations").as("postRecommendation");
            cy.visit(url);
            cy.get("#new-name").type(recommendation.name);
            cy.get("#new-youtubeUrl").type(recommendation.youtubeUrl);
            cy.get("#new-createButton").click();
            cy.wait("@postRecommendation").its('response.statusCode').should('eq', 409);
            cy.on('window:alert', () => {
                expect(true).to.be.true;
            });
        });

    });


    describe("Upvote a recommendation", () => {

        before(() => {
            cy.resetDatabase();
            cy.populateDatabase();
        });

        it("should upvote a recommendation", () => {
            cy.visit(url);
            cy.get("#recommendation-0 #score").invoke("text").then((text) => {
                const score = parseInt(text);
                cy.get("#recommendation-0 #upvote").click();
                cy.wait(2000);
                cy.get("#recommendation-0 #score").invoke("text").then((newText) => {
                    const newScore = parseInt(newText);
                    expect(newScore).to.equal(score + 1);
                });
            })
        });

    })

    describe("Downvote a recommendation", () => {

        before(() => {
            cy.resetDatabase();
            cy.populateDatabase();
        });

        it("should downvote and maintain recommendation with score > -5", () => {
            cy.visit(url);
            cy.get("#recommendation-0 #score").invoke("text").then((text) => {
                const score = parseInt(text);
                cy.get("#recommendation-0 #upvote").click();
                cy.wait(2000);
                cy.get("#recommendation-0 #downvote").click();
                cy.wait(2000);
                cy.get("#recommendation-0 #score").invoke("text").then((newText) => {
                    const newScore = parseInt(newText);
                    expect(newScore).to.equal(score);
                });
            })
        })

        it("should downvote and remove recommendation with score < -5", () => {
            // downvote last (id=4) until score < -5. its title should not appear anymore
            cy.visit(url + 'top');
            cy.get("#recommendation-4 #title").then(($title) => {
                const title = $title.text();
                cy.get("#recommendation-4 #score").then(($score) => {
                    const score = Number($score.text());
                    let updateScore = score;
                    while (updateScore >= -5) {
                        cy.get("#recommendation-4 #downvote").click();
                        updateScore--;
                        cy.wait(1000);
                    }
                    cy.get("#recommendation-4").should("not.exist");
                })
            })
        })

    })

    describe("Random recommendation", () => {

        before(() => {
            cy.resetDatabase();
            cy.populateDatabase();
        });

        it("should see a random recommendation", () => {
            cy.visit(url + 'random');
            cy.get('#recommendation-0').should('exist');
        })

    })

    describe("Top recommendations", () => {

        before(() => {
            cy.resetDatabase();
            cy.populateDatabase();
        });

        it("should see top recommendations", () => {
            cy.visit(url + 'top');
            cy.get('#recommendation-0').should('exist');
        })

        // #recommendation-0 should have score greater than #recommendation-1
        it("should see top recommendations in order", () => {
            cy.visit(url + 'top');
            cy.get('#recommendation-0').should('exist');
            cy.get('#recommendation-1').should('exist');
            cy.get('#recommendation-0 #score').then(($score0) => {
                cy.get('#recommendation-1 #score').then(($score1) => {
                    expect(Number($score0.text())).to.be.greaterThan(Number($score1.text()));
                });
            });
        })

    })

});