import styled from "styled-components";
import ReactPlayer from "react-player";
import { useEffect } from "react";

import useUpvoteRecommendation from "../../hooks/api/useUpvoteRecommendation";

export default function Recommendation({ name, youtubeLink, score, id, onUpvote = () => 0, onDownvote = () => 0 }) {
  const { upvoteRecommendation, errorUpvotingRecommendation } = useUpvoteRecommendation();

  const handleUpvote = async () => {
    await upvoteRecommendation(id);
    onUpvote();
  };

  const handleDownvote = async () => {
    await upvoteRecommendation(id);
    onDownvote();
  };

  useEffect(() => {
    if (errorUpvotingRecommendation) {
      alert("Error upvoting recommendation!");
    }
  }, [errorUpvotingRecommendation]);

  return (
    <Container>
      <Row>{name}</Row>
      <ReactPlayer url={youtubeLink} width="100%" height="100%" />
      <Row>
        <button onClick={handleDownvote}>upvote</button>
        {score}
      </Row>
    </Container>
  );
}

const Container = styled.article`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px 0;
  background-color: rgba(255, 255, 255, .1);
  border-radius: 4px;
  margin-bottom: 15px;
`;

const Row = styled.div`
  padding: 0 15px;
`;
