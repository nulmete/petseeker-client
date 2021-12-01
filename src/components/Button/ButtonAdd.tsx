/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { ButtonProps } from "@mui/material";
import CustomButton from "./CustomButton";

const ButtonAdd: React.FC = ({ ...props }) => {
  return (
    <CustomButton startIcon={<AddIcon />} {...props}>
      Agregar
    </CustomButton>
  );
};

export default ButtonAdd;
