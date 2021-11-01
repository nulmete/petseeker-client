/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  entity: string;
  onClick: () => void;
}

const ButtonAdd: React.FC<Props> = ({ entity, onClick }) => {
  return (
    <Button variant="contained" startIcon={<AddIcon />} onClick={onClick}>
      Agregar {entity}
    </Button>
  );
};

export default ButtonAdd;
