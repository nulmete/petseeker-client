import React from "react";
import { Typography } from "@mui/material";

const SectionHeader: React.FC = ({ children }) => {
  return (
    <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
      {children}
    </Typography>
  );
};

export default SectionHeader;
