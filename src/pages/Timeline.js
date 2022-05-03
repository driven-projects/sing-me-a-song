import { Outlet } from "react-router-dom";

import Header from "../components/Header/Header";
import Menu from "../components/Menu/Menu";
import CreateNewRecommendation from "../components/CreateNewRecommendation/CreateNewRecommendation";

export default function Timeline() {
  return (
    <>
      <Header />
      <Menu />
      <CreateNewRecommendation />
      <Outlet />
    </>
  );
}
