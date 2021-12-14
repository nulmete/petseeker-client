import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { LocalizationProvider } from "@mui/lab";
import reportWebVitals from "./reportWebVitals";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import { UserStateProvider } from "./context/sessionContext";
import App from "./App";
import theme from "./theme/theme";
import "./index.css";
import { LocationStateProvider } from "./context/locationContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <SnackbarProvider maxSnack={1} autoHideDuration={2500}>
          <BrowserRouter>
            <Auth0ProviderWithHistory>
              <CssBaseline />
              <UserStateProvider>
                <LocationStateProvider>
                  <App />
                </LocationStateProvider>
              </UserStateProvider>
            </Auth0ProviderWithHistory>
          </BrowserRouter>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
