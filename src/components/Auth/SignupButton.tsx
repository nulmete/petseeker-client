import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CustomButton from "../Button/CustomButton";

const SignupButton: React.FC = () => {
  const { loginWithRedirect, user } = useAuth0();

  if (user) return null;

  return (
    <CustomButton
      size="large"
      onClick={() =>
        loginWithRedirect({
          screen_hint: "signup",
        })
      }
    >
      Sign Up
    </CustomButton>
  );
};

export default SignupButton;
