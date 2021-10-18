import React from "react";
import Box from "@mui/material/Box";
import SidebarNew from "./Sidebar/Sidebar";
import MainContent from "./MainContent";

const Layout: React.FC = () => {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex" }}>
      <SidebarNew drawerWidth={drawerWidth} />
      <MainContent drawerWidth={drawerWidth} />
    </Box>
  );
};

export default Layout;
