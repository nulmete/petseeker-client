import React from "react";
import { useParams } from "react-router-dom";

interface ParamTypes {
  id: string;
}

const PublicationDetail: React.FC = () => {
  const params = useParams<ParamTypes>();
  return <div>Publication ID: {params.id}</div>;
};

export default PublicationDetail;
