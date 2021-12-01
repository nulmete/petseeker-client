import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { makeStyles } from "@mui/styles";

type Option = {
  label: string;
  value: string;
};

interface Props {
  label: string;
  options: Option[];
  value: string;
  onChange: (e: SelectChangeEvent) => void;
}

const useStyles = makeStyles({
  customOutline: {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.12)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.12)",
    },
    "& label.Mui-focused": {
      color: "black",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
  },
});

const CustomSelectInput: React.FC<Props> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const classes = useStyles();
  return (
    <FormControl
      variant="outlined"
      fullWidth
      classes={{ root: classes.customOutline }}
    >
      <InputLabel id={label} sx={{ fontWeight: 500, backgroundColor: "white" }}>
        {label}
      </InputLabel>
      <Select
        labelId={label}
        id={label}
        value={value}
        label={label}
        onChange={onChange}
        key={label}
        sx={{ fontFamily: "Montserrat" }}
      >
        {options.map((option) => {
          return (
            <MenuItem key={option.value + option.label} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default CustomSelectInput;
