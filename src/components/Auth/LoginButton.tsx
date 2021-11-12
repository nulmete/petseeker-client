import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      type="button"
      onClick={() =>
        loginWithRedirect({ redirectUri: "http://localhost:3000/dashboard" })
      }
    >
      Log In
    </button>
  );
};

export default LoginButton;
