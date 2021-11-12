import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const SignupButton: React.FC = () => {
  const { loginWithRedirect, user } = useAuth0();

  if (user) return null;

  return (
    <button
      type="button"
      onClick={() =>
        loginWithRedirect({
          screen_hint: "signup",
        })
      }
    >
      Sign Up
    </button>
  );
};

export default SignupButton;
