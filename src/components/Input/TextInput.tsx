/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const outlinedSelectors = [
  "& .MuiOutlinedInput-notchedOutline",
  "&:hover .MuiOutlinedInput-notchedOutline",
];
const CustomTextField = styled(TextField)(() => ({
  "& label.Mui-focused": {
    color: "black",
  },
  [outlinedSelectors.join(",")]: {
    borderColor: "rgba(0, 0, 0, 0.12)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
  },
}));

const TextInput: React.FC<TextFieldProps> = (props) => {
  return (
    <CustomTextField
      {...props}
      variant="outlined"
      fullWidth
      InputProps={{
        style: { fontFamily: "Montserrat" },
      }}
      InputLabelProps={{ style: { fontWeight: 500 } }}
      FormHelperTextProps={{ style: { fontWeight: 500 } }}
    />
  );
};

export default TextInput;
