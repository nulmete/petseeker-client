import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import React from "react";
import AuthenticationButton from "../components/Auth/AuthenticationButton";
import SignupButton from "../components/Auth/SignupButton";
import Loading from "../components/Loading";
import PetSeeker from "../assets/petseeker.png";
import Patita from "../assets/patita.png";

const Home: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) return <Loading />;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 30,
      }}
    >
      <div>
        <img
          src={Patita}
          alt=""
          style={{ maxWidth: "200px", display: "block" }}
        />
      </div>
      <div>
        <img
          src={PetSeeker}
          alt=""
          style={{ maxWidth: "200px", display: "block" }}
        />
      </div>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AuthenticationButton />
        <SignupButton />
      </Box>
    </div>
  );
};

export default Home;
