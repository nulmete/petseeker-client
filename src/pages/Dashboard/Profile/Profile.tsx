import React from "react";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import { useUserContext } from "../../../context/sessionContext";

const Profile: React.FC = () => {
  const { currentUser } = useUserContext();

  console.log({ currentUser });

  return (
    <DashboardLayout>
      <pre className="col-12 text-light bg-dark p-4">
        {JSON.stringify(currentUser, null, 2)}
      </pre>
    </DashboardLayout>
  );
};

export default Profile;
