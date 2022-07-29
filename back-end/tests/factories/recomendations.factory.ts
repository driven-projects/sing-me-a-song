import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

import { recommendationRepository } from "../../src/repositories/recommendationRepository";

function randomScore() {
    return Math.floor(Math.random() * 50 - 25);
}

function createRecommendationBody() {
    return {
        name: faker.music.songName(),
        youtubeLink: 'https://www.youtube.com/watch?v=NkuOJNBICyQ'
    }
};

function createRecommendation(id: Number, score: Number) {
    const recommended = createRecommendationBody();
    return {
        id, score,
        ...recommended,
    }
}

async function saveNewRecommendation(initialScore: number) {

    const recommendationBody = createRecommendationBody();

    const created = await prisma.recommendation.create({
        data: {...recommendationBody, score: initialScore},
    });
    
    return created;
}

async function saveRecommendationList(qtd: Number) {
    for (let i = 0; i < qtd; i++) {
        await saveNewRecommendation(randomScore());
    }
}


function createRecommendationList(qtd: Number) {

    const list = [];
    for (let i = 0; i < qtd; i++) {
        let score = randomScore();
        list.push(createRecommendation(i+1, score));
    }

    return list;
}


async function getRecommendationById(id: number) {
    const recommendation = await prisma.recommendation.findFirst({
        where: {id}
    });
    return recommendation;
}


const recommendationsFactory = {
    createRecommendationBody,
    createRecommendation,
    createRecommendationList,
    saveRecommendationList,
    saveNewRecommendation,
    getRecommendationById
};

export default recommendationsFactory;
