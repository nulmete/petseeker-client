import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CustomButton from "../Button/CustomButton";

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <CustomButton
      size="large"
      onClick={() =>
        loginWithRedirect({
          redirectUri: "http://localhost:3000/dashboard/publicaciones",
        })
      }
    >
      Log In
    </CustomButton>
  );
};

export default LoginButton;
