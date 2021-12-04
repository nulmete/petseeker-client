/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const outlinedSelectors = [
  "& .MuiOutlinedInput-root:not(.Mui-error) .MuiOutlinedInput-notchedOutline",
  "&:hover .MuiOutlinedInput-root:not(.Mui-error) .MuiOutlinedInput-notchedOutline",
];
const CustomTextField = styled(TextField)(() => ({
  "& label.Mui-focused:not(.Mui-error)": {
    color: "black",
  },
  [outlinedSelectors.join(",")]: {
    borderColor: "rgba(0, 0, 0, 0.12)",
  },
  "& .MuiOutlinedInput-root.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline":
    {
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
