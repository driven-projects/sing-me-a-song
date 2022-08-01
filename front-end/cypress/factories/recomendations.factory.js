import { faker } from "@faker-js/faker";

function randomScore() {
    return Math.floor(Math.random() * 50 - 25);
}

function createRecommendationBody() {
    return {
        name: faker.music.songName(),
        youtubeUrl: 'https://www.youtube.com/watch?v=NkuOJNBICyQ'
    }
};

function createRecommendation(id, score) {
    const recommended = createRecommendationBody();
    return {
        id, score,
        ...recommended,
    }
}


function createRecommendationList(qtd) {

    const list = [];
    for (let i = 0; i < qtd; i++) {
        let score = randomScore();
        list.push(createRecommendation(i + 1, score));
    }

    return list;
}


const recommendationsFactory = {
    createRecommendationBody,
    createRecommendation,
    createRecommendationList,
};

export default recommendationsFactory;
