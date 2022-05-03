import useAsync from "../useAsync";

import * as service from "../../services/recommendations";

export default function useRecommendation() {
  const { data, loading, act } = useAsync(service.get);

  const update = (id) => {
    act(id);
  };

  return {
    recommendation: data,
    loadingRecommendation: loading,
    getRecommendation: act,
    updateRecommendation: update
  };
}
