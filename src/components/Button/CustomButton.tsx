/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Button, ButtonProps, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CustomButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Button
      type="button"
      variant="contained"
      size={matches ? "small" : "medium"}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
