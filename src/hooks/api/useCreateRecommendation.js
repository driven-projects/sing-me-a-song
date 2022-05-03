import useAsync from "../useAsync";
import * as service from "../../services/recommendations";

export default function useRecommendations() {
  const { loading, act, error } = useAsync(service.create, false);

  return {
    loadingCreatingRecommendation: loading,
    createRecommendation: act,
    creatingRecommendationError: error
  };
}
