import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div>
      <div>MainLayout</div>
      <Outlet />
    </div>
  );
};

export default MainLayout;
