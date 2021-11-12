import React from "react";

import { useAuth0 } from "@auth0/auth0-react";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";

const Profile: React.FC = () => {
  const { user } = useAuth0();

  return (
    <DashboardLayout>
      <pre className="col-12 text-light bg-dark p-4">
        {JSON.stringify(user, null, 2)}
      </pre>
    </DashboardLayout>
  );
};

export default Profile;
