import * as service from "../../services/recommendations";

import useAsync from "../useAsync";

export default function useDownvoteRecommendation() {
  const { loading, act, error } = useAsync(service.downvote, false);

  return {
    loadingDownvoteRecommendations: loading,
    downvoteRecommendation: act,
    errorDownvotingRecommendation: error
  };
}
