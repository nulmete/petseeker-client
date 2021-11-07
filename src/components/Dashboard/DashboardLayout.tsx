import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container, Toolbar } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";

const DashboardLayout: React.FC = () => {
  const drawerWidth = 350;

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
        {/* <Container maxWidth="xl"> */}
        <Outlet />
        {/* </Container> */}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
