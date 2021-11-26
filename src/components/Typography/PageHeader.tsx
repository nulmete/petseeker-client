import React from "react";
import { Typography } from "@mui/material";

const PageHeader: React.FC = ({ children }) => {
  return (
    <Typography variant="h4" component="h2">
      {children}
    </Typography>
  );
};

export default PageHeader;
