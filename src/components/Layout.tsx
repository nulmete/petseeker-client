import React from "react";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./MainContent";

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <MainContent />
    </Box>
  );
};

export default Layout;
