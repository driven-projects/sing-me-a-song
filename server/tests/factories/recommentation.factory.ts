import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";
import { youtubeLinkRegex } from "../../src/schemas/recommendationsSchemas";
import RandExp from "randexp";

export class RecommendationFactory {
  LinkGenerator: RandExp;
  constructor() {
    this.LinkGenerator = new RandExp(youtubeLinkRegex);
  }

  randomNumber(digits: number) {
    return faker.random.numeric(digits);
  }

  newMockRecommendation({ wrongLink = false } = {}) {
    let name = faker.internet.userName();
    let youtubeLink = this.LinkGenerator.gen();

    if (wrongLink) youtubeLink = faker.random.alpha();

    return {
      name,
      youtubeLink,
    };
  }

  async registerNewRecommendation() {
    const { name, youtubeLink } = this.newMockRecommendation();
    const { id } = await prisma.recommendation.create({
      data: { name, youtubeLink },
    });
    return { id, name, youtubeLink };
  }
}
