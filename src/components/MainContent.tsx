import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Routes from "./Routes/Routes";

interface Props {
  drawerWidth: number;
}

const MainContent: React.FC<Props> = ({ drawerWidth = 240 }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar />

      <Routes />
    </Box>
  );
};

export default MainContent;
