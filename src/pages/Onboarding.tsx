import React from "react";

const Onboarding: React.FC = () => {
  const continueAuth = async () => {
    console.log("continuing auth...");
    const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get("state");
    window.location.href = `https://${auth0Domain}/continue?state=${state}`;
  };

  return (
    <div>
      <h1>Onboarding</h1>
      {/* TODO: profile information here */}
      <button type="button" onClick={continueAuth}>
        Submit onboarding page
      </button>
    </div>
  );
};

export default Onboarding;
