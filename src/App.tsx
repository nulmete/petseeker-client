import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Loading from "./components/Loading";

// Pages
import Profile from "./pages/Dashboard/Profile/Profile";
import PublicationAdd from "./pages/Dashboard/Publications/PublicationAdd";
import Publications from "./pages/Dashboard/Publications/Publications";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";

const App: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) return <Loading />;

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/onboarding" exact component={Onboarding} />
      <ProtectedRoute
        path="/dashboard/publicaciones"
        exact
        component={Publications}
      />
      <ProtectedRoute
        path="/dashboard/publicaciones/agregar"
        exact
        component={PublicationAdd}
      />
      <ProtectedRoute path="/dashboard/perfil" exact component={Profile} />
    </Switch>
  );
};

export default App;
