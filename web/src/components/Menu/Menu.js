import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { FaHome } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { FiShuffle } from "react-icons/fi";

export default function Menu() {
  const navigate = useNavigate();

  return (
    <StyledMenu>
      <MenuItem onClick={() => navigate("/")}>
        <FaHome />
        Home
      </MenuItem>

      <MenuItem onClick={() => navigate("/top")}>
        <HiTrendingUp />
        Top
      </MenuItem>

      <MenuItem onClick={() => navigate("/random")}>
        <FiShuffle />
        Random
      </MenuItem>
    </StyledMenu>
  )
}

const StyledMenu = styled.div`
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  margin: 15px auto;
  padding: 10px 14px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  text-transform: lowercase;
  gap: 15px;
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;
`;
