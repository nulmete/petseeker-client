/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Route, RouteProps } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading";

const ProtectedRoute: React.FC<RouteProps> = ({ component, ...args }) => {
  const componentToUse = component;

  const onRedirect = (): JSX.Element => {
    return <Loading />;
  };

  return (
    <Route
      {...args}
      render={(props) => {
        const WrappedComponent = withAuthenticationRequired(
          componentToUse as React.ComponentType<any>,
          { onRedirecting: onRedirect }
        );
        return <WrappedComponent {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
