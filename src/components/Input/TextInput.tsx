/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

const TextInput: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField
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
