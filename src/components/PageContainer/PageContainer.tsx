import { Container, Theme } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const PageContainer: React.FC<Props> = ({ children }) => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: (theme: Theme) => theme.spacing(2),
      }}
    >
      {children}
    </Container>
  );
};

export default PageContainer;
