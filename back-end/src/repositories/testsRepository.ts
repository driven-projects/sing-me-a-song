import { prisma } from "../database.js"

export const testsRepository = {
  resetDatabase() {
    return prisma.$transaction([
      prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`,
    ])
  },
}
