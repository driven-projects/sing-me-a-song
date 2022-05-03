import * as service from "../../services/recommendations";

import useAsync from "../useAsync";

export default function useUpvoteRecommendation() {
  const { loading, act, error } = useAsync(service.upvote, false);

  return {
    loadingUpvoteRecommendations: loading,
    upvoteRecommendation: act,
    errorUpvotingRecommendation: error
  };
}
