import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import {
  recommendationFactory,
  getRecommendationsMock,
} from "../factories/recommendationFactory";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("Testes para a função de criação de recomendação", () => {
  it("Cria a recomendação corretamente caso os dados de criação estejam válidos", async () => {
    const recommendation = await recommendationFactory();

    jest.spyOn(recommendationRepository, "findByName").mockResolvedValue(null);
    jest.spyOn(recommendationRepository, "create").mockResolvedValue();

    await recommendationService.insert(recommendation);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it("Não cria recomendações com o mesmo nome", async () => {
    const recommendation = await recommendationFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementation((): any => {
        return {
          id: 1,
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink,
          score: 3,
        };
      });

    const result = recommendationService.insert(recommendation);
    const typeError = {
      type: "conflict",
      message: "Recommendations names must be unique",
    };

    expect(result).rejects.toEqual(typeError);
    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe("Testes para as funções de pontuação das recomendações", () => {
  it("Aumenta a pontuação em 1 quando o id é válido", async () => {
    const recommendation = await recommendationFactory();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink,
          score: 3,
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(1);
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Não aumenta a pontuação quando o id é inválido ou não existe", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    const result = recommendationService.upvote(999);
    const typeError = {
      type: "not_found",
      message: "Recommendation not found",
    };

    expect(result).rejects.toEqual(typeError);
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });

  it("Diminui a pontuação em 1 quando o id é válido", async () => {
    const recommendation = await recommendationFactory();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          ...recommendation,
          id: 1,
          score: 3,
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return {
          ...recommendation,
          id: 1,
          score: 3,
        };
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(1);
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Não diminui a pontuação em 1 quando o id é inválido", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    const result = recommendationService.downvote(999);
    const typeError = {
      type: "not_found",
      message: "Recommendation not found",
    };

    expect(result).rejects.toEqual(typeError);
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });

  it("Remove a recomendação quando a pontuação é menor que -5", async () => {
    const recommendation = await recommendationFactory();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          ...recommendation,
          id: 1,
          score: -6,
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return {
          ...recommendation,
          id: 1,
          score: -6,
        };
      });

    await recommendationService.downvote(1);

    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("Testes para as funções de visualização de recomendações", () => {
  it("Retorna as últimas 10 recomendações", async () => {
    const recommendations = await getRecommendationsMock(10);

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return recommendations;
      });

    await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("Retorna uma recomendação pelo id", async () => {
    const recommendation = await recommendationFactory();

    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return {
        ...recommendation,
        id: 1,
        score: 3,
      };
    });

    const result = await recommendationService.getById(1);

    expect(result).toBeInstanceOf(Object);
    expect(recommendationRepository.find).toBeCalled();
  });

  it("Retorna not_found quando não existe a recomendação pelo id", async () => {
    
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null)

    const result = recommendationService.getById(2);

    const typeError = { type: "not_found", message: "Recommendation not found" };
    expect(result).rejects.toEqual(typeError);
  });

  it("Retorna uma música aleatória com score maior que 10",async () => {
    const recommendations = await getRecommendationsMock(15)
    console.log(recommendations)
    const recommendationsWithScoreGreaterThan10 = recommendations.filter(recommendation => recommendation.score > 10)

    jest.spyOn(Math, "random").mockImplementationOnce(():any  =>{
      return 0.4
    })
  
    jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(():any => {
      return recommendationsWithScoreGreaterThan10
  })
    
    const result = await recommendationService.getRandom()
    expect(result.score).toBeGreaterThan(10)

  })


  it("Retorna not_found caso não haja nenhuma música cadastrada", async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce((): any => {
      const emptyArr: [] = []

      return emptyArr
    })

    const result = recommendationService.getRandom()
   
    const typeError = {type: "not_found", message: "Recommendation not found"};
    expect(result).rejects.toEqual(typeError)
  })

  it("Retorna a lista de top músicas ordenadas pela sua pontuação", async () => {
    const amount = 10
   const recommendations = await getRecommendationsMock(amount)
 

   jest.spyOn(recommendationRepository,'getAmountByScore').mockImplementationOnce(():any =>{
    return recommendations
   }) 

   const result = await recommendationService.getTop(amount)
   const isSorted = isSortedFn(result)
   
   expect(isSorted).toEqual(true)
   expect(recommendationRepository.getAmountByScore).toBeCalled()
 })
});


function isSortedFn(arr: object[]){
    for (let i = 1; i < arr.length; i++) {
      if(arr[i] > arr[i-1]) {
          return false
      }
    }
    return true
}
