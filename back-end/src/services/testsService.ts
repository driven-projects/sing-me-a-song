import { testsRepository } from "../repositories/testsRepository.js"

export const testsService = {
  async resetDatabase() {
    await testsRepository.resetDatabase()
  },
}
