import styled from "styled-components";
import { VscPlayCircle } from "react-icons/vsc";

export default function Header() {
  return (
    <StyledHeader>
      <VscPlayCircle size="28px" color="#e90000" />
      Sing me a Song
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  text-transform: lowercase;
  font-weight: 400;
`;
