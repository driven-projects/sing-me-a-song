import {prisma} from "../src/database/database"

import {faker} from "@faker-js/faker"
 async function main(){
   

    for(let i = 0; i < 2 ; i++){
        const randomScore = Math.floor(Math.random()*10)
        const recommendation = {
            name:faker.music.songName(),
            youtubeLink:"youtubeLInk",
        }
        await prisma.recommendation.create({data:recommendation})
       
        await prisma.recommendation.upsert({
            where:{name: recommendation.name},
            update:{score:randomScore},
            create:recommendation
        })
    }

   
}

main().catch(e => {
    console.log(e)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})