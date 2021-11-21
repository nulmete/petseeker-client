import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSnackbar } from "notistack";

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
    <button type="button" onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
