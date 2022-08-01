// import Prisma from '@prisma/client';

// const prisma = new Prisma.PrismaClient();

// // seed data

// const recommendations = [
//     {name: 'The Sign', youtubeLink: 'https://www.youtube.com/watch?v=NkuOJNBICyQ', score: -5},
//     {name: 'Tudo Nosso', youtubeLink: 'https://www.youtube.com/watch?v=NkuOJNBICyQ', score: 0},
//     {name: 'Company', youtubeLink: 'https://www.youtube.com/watch?v=NkuOJNBICyQ', score: 10},
//     {name: 'Vacation', youtubeLink: 'https://www.youtube.com/watch?v=NkuOJNBICyQ', score: 20},
//     {name: 'Best You Had', youtubeLink: 'https://www.youtube.com/watch?v=NkuOJNBICyQ', score: 5},
// ]

// async function main() {
//     await prisma.recommendation.createMany({ data: recommendations });
// }

// main()
// .catch(console.error)
// .finally(async () => await prisma.$disconnect());