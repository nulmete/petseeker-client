import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", '"Helvetica Neue"', "Arial", "sans-serif"].join(
      ","
    ),
  },
  palette: {
    primary: {
      // rojo
      main: "#d36353",
    },
    secondary: {
      // amarillo
      main: "#f2efe6",
    },
  },
});

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
