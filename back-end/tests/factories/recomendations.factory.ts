import { faker } from "@faker-js/faker";

function createBody() {
    return {
        name: faker.music.songName(),
        youtubeLink: 'https://www.youtube.com/watch?v=NkuOJNBICyQ'
    }
};

const recommendationsFactory = {
    createBody,
};

export default recommendationsFactory;
