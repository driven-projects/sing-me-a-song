import { Prisma } from "@prisma/client";
import { prisma } from "../database.js";
import { CreateRecommendationData } from "../services/recommendationsService.js";

async function create(createRecommendationData: CreateRecommendationData) {

  console.log('aqui 1')

  await prisma.recommendation.create({
    data: createRecommendationData,
  });
}

interface FindAllWhere {
  score: number;
  scoreFilter: "lte" | "gt";
}

function findAll(findAllWhere?: FindAllWhere) {

  console.log('aqui 2')

  const filter = getFindAllFilter(findAllWhere);

  return prisma.recommendation.findMany({
    where: filter,
    orderBy: { id: "desc" },
    take: 10
  });
}

function getAmountByScore(take: number) {
  console.log('aqui 3')

  return prisma.recommendation.findMany({
    orderBy: { score: "desc" },
    take,
  });
}

function getFindAllFilter(
  findAllWhere?: FindAllWhere
): Prisma.RecommendationWhereInput {

  console.log('aqui 4')


  if (!findAllWhere) return {};

  const { score, scoreFilter } = findAllWhere;

  return {
    score: { [scoreFilter]: score },
  };
}

function find(id: number) {

  console.log('aqui 5')

  return prisma.recommendation.findUnique({
    where: { id },
  });
}

function findByName(name: string) {

  console.log('aqui 6')

  return prisma.recommendation.findUnique({
    where: { name },
  });
}

async function updateScore(id: number, operation: "increment" | "decrement") {

  console.log('aqui 7')

  return prisma.recommendation.update({
    where: { id },
    data: {
      score: { [operation]: 1 },
    },
  });
}

async function remove(id: number) {

  console.log('aqui 8')

  await prisma.recommendation.delete({
    where: { id },
  });
}

async function reset() {

  console.log('aqui 9')

  await prisma.recommendation.deleteMany({});
}

export const recommendationRepository = {
  create,
  findAll,
  find,
  findByName,
  updateScore,
  getAmountByScore,
  remove,
  reset,
};
