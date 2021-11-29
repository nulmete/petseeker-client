import React from "react";
import { Typography } from "@mui/material";

const SectionHeader: React.FC = ({ children }) => {
  return (
    <Typography
      variant="h6"
      component="h3"
      sx={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600 }}
    >
      {children}
    </Typography>
  );
};

export default SectionHeader;
