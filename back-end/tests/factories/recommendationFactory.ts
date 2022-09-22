import {faker} from "@faker-js/faker"
import {prisma} from "../../src/database/database"

interface IRecommendation {
    name:string;
    youtubeLink:string;
}


export async function recommendationFactory(){
    const recommendation: IRecommendation = {
        name:faker.music.songName(),
        youtubeLink: "https://www.youtube.com/watch?v=h_D3VFfhvs4"
    }
    
    return recommendation
}

export async function populateRecommendationsWithRandomScores(amount: number){

    for(let i =0; i < amount; i++){
        const randomScore = Math.floor(Math.random()*10)

        const recommendation = {
            name:faker.music.songName(),
            youtubeLink: "https://www.youtube.com/watch?v=h_D3VFfhvs4",
            score: randomScore
        }
       
        await prisma.recommendation.create({data:recommendation})


    }
}