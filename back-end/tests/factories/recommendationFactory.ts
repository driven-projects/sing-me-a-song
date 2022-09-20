import {faker} from "@faker-js/faker"

interface IRecommendation {
    name: string;
    youtubeLink: string;
}

export default async function recommendationFactory(){
    const recommendation: IRecommendation = {
        name:faker.music.songName(),
        youtubeLink: faker.internet.url()
    }

    return recommendation
}