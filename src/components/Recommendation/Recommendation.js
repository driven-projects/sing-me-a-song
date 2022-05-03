import styled from "styled-components";
import ReactPlayer from "react-player";

export default function Recommendation({ name, youtubeLink, score }) {
  return (
    <Container>
      <Row>{name}</Row>
      <ReactPlayer url={youtubeLink} width="100%" height="100%" />
      <Row>{score}</Row>
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
`;

const Row = styled.div`
  padding: 0 15px;
`;
