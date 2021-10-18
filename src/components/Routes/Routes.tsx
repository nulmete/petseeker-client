import React from "react";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "../../constants";
import Publications from "../Publications/Publications";

const Routes: React.FC = () => {
  return (
    <Switch>
      {/* TODO: NotFound component */}
      <Route path={ROUTES.NOT_FOUND} component={() => <div>NOT FOUND</div>} />
      <Route path={ROUTES.HOME} component={Publications} />
      <Route path={ROUTES.TEST1} component={() => <div>Test1</div>} />
      <Route path={ROUTES.TEST2} component={() => <div>Test2</div>} />
    </Switch>
  );
};

export default Routes;
