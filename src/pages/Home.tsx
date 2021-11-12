import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import AuthenticationButton from "../components/Auth/AuthenticationButton";
import SignupButton from "../components/Auth/SignupButton";
import Loading from "../components/Loading";

const Home: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) return <Loading />;

  return (
    <div>
      <AuthenticationButton />
      <SignupButton />
    </div>
  );
};

export default Home;
