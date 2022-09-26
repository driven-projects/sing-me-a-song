import { useState } from "react";
import styled from "styled-components";

import { IoReturnUpForwardOutline } from "react-icons/io5";

export default function CreateNewRecommendation({
  onCreateNewRecommendation = () => 0,
  disabled = false,
}) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleCreateRecommendation = () => {
    onCreateNewRecommendation({
      name,
      link,
    });
    setLink("");
    setName("");
  };

  return (
    <Container>
      <Input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
        data-test-id="musicName"
      />
      <Input
        type="text"
        placeholder="https://youtu.be/..."
        value={link}
        onChange={(e) => setLink(e.target.value)}
        disabled={disabled}
        data-test-id="musicYoutubeLink"
      />
      <Button onClick={() => handleCreateRecommendation()} disabled={disabled}>
        <IoReturnUpForwardOutline
          size="24px"
          color="#fff"
          data-test-id="submitRecommendation"
        />
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: 9px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  background-color: #fff;
  border: none;
  border-radius: 4px;
  padding: 9px 13px;
  color: #141414;
  width: 100%;
  font-family: "Lexend Deca", sans-serif;

  &:disabled {
    opacity: 0.8;
  }

  &::placeholder {
    color: #c4c4c4;
  }
`;

const Button = styled.button`
  background-color: #e90000;
  border: none;
  border-radius: 4px;
  padding: 9px 13px;
  width: 59px;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.8;
  }
`;
