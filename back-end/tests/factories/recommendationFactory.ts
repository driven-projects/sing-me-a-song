import {faker} from "@faker-js/faker"
import {recommendationService} from "../../src/services/recommendationsService"

interface IRecommendation {
    name: string;
    youtubeLink: string;
}

export default async function recommendationFactory(){
    const recommendation: IRecommendation = {
        name:faker.music.songName(),
        youtubeLink: "https://www.youtube.com/watch?v=h_D3VFfhvs4"
    }

    

    return recommendation
}