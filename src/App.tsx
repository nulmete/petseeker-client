import React from "react";
import { Switch, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// Components
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Loading from "./components/Loading";

// Pages
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Dashboard/Profile/Profile";
import PublicationAdd from "./pages/Dashboard/Publications/PublicationAdd";
import PublicationDetail from "./pages/Dashboard/Publications/PublicationDetail";
import Publications from "./pages/Dashboard/Publications/Publications";
import UserService from "./services/users";
import { useUserContext } from "./context/sessionContext";

const App: React.FC = () => {
  const { user, isLoading } = useAuth0();
  const { currentUser, setCurrentUser } = useUserContext();

  const getCurrentUser = (uuid: string) => {
    return UserService.getUserByUUID(uuid);
  };

  React.useEffect(() => {
    if (user && user.sub) {
      const uuid = user.sub.split("|")[1];
      getCurrentUser(uuid)
        .then((res) => {
          console.log({ res });
          setCurrentUser(res);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/onboarding/:id" exact component={Onboarding} />
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
      <ProtectedRoute
        path="/dashboard/publicaciones/:id"
        exact
        component={PublicationDetail}
      />
      <ProtectedRoute path="/dashboard/perfil" exact component={Profile} />
    </Switch>
  );
};

export default App;
