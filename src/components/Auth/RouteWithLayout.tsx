/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Route } from "react-router-dom";

interface Props {
  layout: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

const RouteWithLayout: React.FC<Props> = ({
  layout: Layout,
  component: Component,
  ...props
}) => {
  return (
    <Route
      {...props}
      render={(renderProps) => {
        return (
          <Layout>
            <Component {...renderProps} />
          </Layout>
        );
      }}
    />
  );
};

export default RouteWithLayout;
