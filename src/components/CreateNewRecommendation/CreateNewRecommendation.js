import { useState } from "react";
import styled from "styled-components";

import { IoReturnUpForwardOutline } from "react-icons/io5";

export default function CreateNewRecommendation({ onCreateNewRecommendation = () => 0 }) {
  const [link, setLink] = useState("");
  
  return (
    <Container>
      <Input type="text" placeholder="https://youtu.be/..." value={link} onChange={e => setLink(e.target.value)} />
      <Button onClick={() => onCreateNewRecommendation(link)}>
        <IoReturnUpForwardOutline size="24px" color="#fff" />
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: 9px;
`;

const Input = styled.input`
  background-color: #fff;
  border: none;
  border-radius: 4px;
  padding: 9px 13px;
  color: #141414;
  width: 100%;
  font-family: "Lexend Deca", sans-serif;

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
`;
