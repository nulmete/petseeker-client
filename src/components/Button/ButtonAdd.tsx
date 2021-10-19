import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  entity: string;
}

const ButtonAdd: React.FC<Props> = ({ entity }) => {
  return (
    <Button variant="contained" startIcon={<AddIcon />}>
      Agregar {entity}
    </Button>
  );
};

export default ButtonAdd;
