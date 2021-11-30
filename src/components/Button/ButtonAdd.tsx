/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { ButtonProps } from "@mui/material";

interface Props extends ButtonProps {
  entity: string;
}

const ButtonAdd: React.FC<Props> = ({ entity, ...props }) => {
  return (
    <Button variant="contained" startIcon={<AddIcon />} {...props}>
      Agregar
    </Button>
  );
};

export default ButtonAdd;
