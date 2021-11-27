import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin,
    });
    enqueueSnackbar("Su sesión fue cerrada exitosamente.", {
      variant: "success",
    });
  };

  return (
    <Button
      onClick={handleLogout}
      variant="text"
      color="primary"
      sx={{ width: "100%" }}
    >
      Cerrar Sesión
    </Button>
  );
};

export default LogoutButton;
