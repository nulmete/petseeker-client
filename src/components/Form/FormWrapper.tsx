import React from "react";
import { Box, Theme } from "@mui/material";

interface Props {
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

const FormWrapper: React.FC<Props> = ({ children, onSubmit }) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        "& > *:not(:last-child)": {
          marginBottom: (theme: Theme) => theme.spacing(2),
        },
      }}
    >
      {children}
    </Box>
  );
};

export default FormWrapper;
