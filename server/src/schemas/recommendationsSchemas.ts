import joi from "joi";
import { CreateRecommendationData } from "../services/recommendationsService.js";

export const youtubeLinkRegex =
  /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

export const recommendationSchema = joi.object<CreateRecommendationData>({
  name: joi.string().required(),
  youtubeLink: joi.string().required().pattern(youtubeLinkRegex),
});
