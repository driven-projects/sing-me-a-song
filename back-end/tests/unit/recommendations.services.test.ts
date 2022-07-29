import { jest } from "@jest/globals";
import app from '../../src/app.js';
import supertest from 'supertest';
import { prisma } from "../../src/database.js";
import { recommendationService } from '../../src/services/recommendationsService.js';
import { Recommendation } from "@prisma/client";
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { conflictError, notFoundError } from '../../src/utils/errorUtils.js';
import recommendationsFactory from '../factories/recomendations.factory.js';

jest.mock("../../src/repositories/recommendationRepository.js");

beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(async () => {
    await prisma.$disconnect();
});


describe("Recommendations Service", () => {

    const recomendationBody = {
        valid: recommendationsFactory.createRecommendationBody(),
        invalid: {
            null: {name: null, youtubeLink: null},
            empty: {name: "", youtubeLink: ""},
        },
    }

    const recommendations = recommendationsFactory.createRecommendationList(10);

    jest.spyOn(recommendationRepository, "create").mockImplementation((): any => {
        const recommendation = recommendationsFactory.createRecommendationBody();
        return {id: 1, ...recommendation,score: 0}
    });

    describe('Insert recommendation', () => {

        it('should insert a new recommendation', async () => {
            const recommendation = recomendationBody.valid;
            jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => { });
            jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => { });
            
            await recommendationService.insert(recommendation);
            expect(recommendationRepository.findByName).toHaveBeenCalled();
            expect(recommendationRepository.create).toHaveBeenCalled();
        })

        it('should throw an error if the name is already taken', async () => {
            const recommendation = recomendationBody.valid;
            jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {
                return {id: 1, ...recommendation, score: 5};
            });

            const promise = recommendationService.insert(recommendation);
            expect(promise).rejects.toEqual(conflictError("Recommendations names must be unique"));
        })
    })

    describe('Upvote recommendation', () => {
        
        it('should upvote a recommendation', async () => {
            jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => { });
            jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => {
                return recommendations[0];
            });
            
            await recommendationService.upvote(1);
            expect(recommendationRepository.updateScore).toHaveBeenCalled();
        });

        it('should throw an error if the recommendation does not exist', async () => {
            jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => {
                return null;
            });
            const promise = recommendationService.upvote(1);
            expect(promise).rejects.toEqual(notFoundError());
        });
    })

    describe('Downvote recommendation', () => {

        it('should downvote a recommendation (>-5)', async () => {
            jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {return recommendations[0];});
            jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => { return recommendations[0];});
            jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => { });

            await recommendationService.downvote(1);
            expect(recommendationRepository.updateScore).toHaveBeenCalled();
            expect(recommendationRepository.remove).not.toHaveBeenCalled();
        })
        
        it('should downvote a recommendation and remove (<-5)', async () => {
            const obj = {...recommendations[0], score: -6};
            jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {return obj});
            jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => {return obj;});
            jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => { });
            
            await recommendationService.downvote(2);
            expect(recommendationRepository.updateScore).toHaveBeenCalled();
            expect(recommendationRepository.remove).toHaveBeenCalled();
        })

        it('should throw an error if the recommendation does not exist', async () => {
            jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => {
                return null;
            });
            const promise = recommendationService.downvote(1);
            expect(promise).rejects.toEqual(notFoundError());
        });
    })

    describe('Get all recommendations', () => {
        it('should get all recommendations', async () => {
            jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => { return recommendations; });
            
            const result = await recommendationService.get();
            expect(recommendationRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(recommendations);
        }
    )})

    describe('Get recommendation by id', () => {
        it('should get a recommendation', async () => {
            jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { return recommendations[0]; });
            const result = await recommendationService.getById(1);
            expect(recommendationRepository.find).toHaveBeenCalled();
            expect(result).toEqual(recommendations[0]);
        })

        it('should throw an error if the recommendation does not exist', async () => {
            jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { return null; });
            const promise = recommendationService.getById(1);
            expect(promise).rejects.toEqual(notFoundError());
        })
    });
    
    describe('Get random recommendation', () => {

        const recommendationsGreaterThan10 = recommendations.filter(r => r.score > 10);
        const recommendationsLesserThan10 = recommendations.filter(r => r.score < 10);

        describe('if random < 70%', () => {
            beforeEach(() => {
                jest.spyOn(Math, "random").mockImplementation((): any => { 
                    return 0.35;
                });
            })
            
            it('if there are recommendations with score > 10, return one of them' , async () => {
                jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => { 
                    return recommendationsGreaterThan10;
                });

                const result = await recommendationService.getRandom();
                const resultIsInRecommendations = recommendationsGreaterThan10.some(r => r.id === result.id);
                const resultScoreIsGreaterThan10 = result.score > 10;
                expect(recommendationRepository.findAll).toHaveBeenCalled();
                expect(resultIsInRecommendations).toBe(true);
                expect(resultScoreIsGreaterThan10).toBe(true);
            });
            
            it('if there are no recommendations with score > 10, return any', async () => {
                jest.spyOn(recommendationRepository, "findAll").mockImplementation(( input?: any ): any => { 
                    return input ? [] : recommendationsLesserThan10;
                });
                
                const result = await recommendationService.getRandom();
                const resultIsInRecommendations = recommendationsLesserThan10.some(r => r.id === result.id);
                const resultScoreIsLesserThan10 = result.score < 10;
                expect(recommendationRepository.findAll).toHaveBeenCalled();
                expect(resultIsInRecommendations).toBe(true);
                expect(resultScoreIsLesserThan10).toBe(true);
            })
        })

        describe('if random > 70%', () => {
            
            beforeEach(() => {
                jest.spyOn(Math, "random").mockImplementation((): any => { 
                    return 0.85;
                });
            })

            it ('if there are recommendations with score < 10, return one of them', async () => {

                jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => { 
                    return recommendationsLesserThan10;
                }
                );

                const result = await recommendationService.getRandom();
                const resultIsInRecommendations = recommendationsLesserThan10.some(r => r.id === result.id);
                const resultScoreIsLesserThan10 = result.score < 10;
                expect(recommendationRepository.findAll).toHaveBeenCalled();
                expect(resultIsInRecommendations).toBe(true);
                expect(resultScoreIsLesserThan10).toBe(true);
            })

            it ('if there are no recommendations with score < 10, return any', async () => {
                jest.spyOn(recommendationRepository, "findAll").mockImplementation(( input?: any ): any => { 
                    return input ? [] : recommendationsGreaterThan10;
                }
                );
                const result = await recommendationService.getRandom();
                const resultIsInRecommendations = recommendationsGreaterThan10.some(r => r.id === result.id);
                const resultScoreIsGreaterThan10 = result.score > 10;
                expect(recommendationRepository.findAll).toHaveBeenCalled();
                expect(resultIsInRecommendations).toBe(true);
                expect(resultScoreIsGreaterThan10).toBe(true);
            })
        })

        
        describe('if there are no recommendations', () => {

            jest.spyOn(Math, "random").mockImplementation((): any => { 
                return 0.5;
            });

            it ('should throw an error', async () => {
                jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => { 
                    return [];
                });
                const promise = recommendationService.getRandom();
                expect(promise).rejects.toEqual(notFoundError());
            })
        })
        
    })

    describe('Get # of recommendations ordered by score', () => {

        it('receiving 4, should return 4 recommendations ordered', async () => {
            const qtd = 4;
            
            jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementation((): any => { 
                const ord = orderByScore(recommendations);
                return returnAmount(ord, qtd);
            });
            
            const result = await recommendationService.getTop(qtd);
            expect(recommendationRepository.getAmountByScore).toHaveBeenCalled();
            expect(result.length === qtd || result.length === recommendations.length).toBe(true);            
            expect(isOrderedByScore(result)).toEqual(true);
        })

        it('receiving more than recommendations, should return all recommendations ordered', async () => {
            const qtd = recommendations.length + 1;
            
            jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementation((): any => { 
                const ord = orderByScore(recommendations);
                return returnAmount(ord, qtd);
            });
            
            const result = await recommendationService.getTop(qtd);
            expect(recommendationRepository.getAmountByScore).toHaveBeenCalled();
            expect(result.length === recommendations.length).toBe(true);            
            expect(isOrderedByScore(result)).toEqual(true);
        })
        
    })

    describe('Reset', () => {
        it ('should reset the recommendations', async () => {
            jest.spyOn(recommendationRepository, "reset").mockImplementationOnce((): any => { return recommendations; });
            const result = await recommendationService.reset();
            expect(recommendationRepository.reset).toHaveBeenCalled();
        })
    })
})

function isOrderedByScore ( array: Recommendation[] ): boolean {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i].score < array[i + 1].score) {
            return false;
        }
    }
    return true;
}

function orderByScore (array: Recommendation[]): Recommendation[] {
    return array.sort((a, b) => {
        return b.score - a.score;
    });
}

function returnAmount (array: Recommendation[], amount: number): Recommendation[] {
    if (array.length < amount) {
        return array;
    }
    return array.slice(0, amount);
}