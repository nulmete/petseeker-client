import React from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";

const DashboardLayout: React.FC = ({ children }) => {
  const drawerWidth = 280;

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

        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
