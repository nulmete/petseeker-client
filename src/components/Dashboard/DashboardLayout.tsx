import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
// import MainContent from "./MainContent";

const DashboardLayout: React.FC = () => {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar drawerWidth={drawerWidth} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
