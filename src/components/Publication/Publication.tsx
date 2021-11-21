/* eslint-disable camelcase */
import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";

// Testing purposes
import Dog from "../../assets/dog.jpg";
import { IPublication } from "../../types/Publication";

interface Props {
  publication: IPublication;
  handlePublicationDelete: () => Promise<void>;
  handlePublicationDetail: () => void;
}

const Publication: React.FC<Props> = ({
  publication,
  handlePublicationDelete,
  handlePublicationDetail,
}) => {
  const { pet_name, pub_type } = publication;
  return (
    <Card onClick={handlePublicationDetail} sx={{ cursor: "pointer" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            U
          </Avatar>
        }
        title="Username"
        subheader="September 14, 2016"
      />
      {/* TODO: figure out responsive height */}
      <CardMedia component="img" height="220" image={Dog} alt="Dog" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {pet_name || "Sin nombre"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pub_type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Distancia mascota - usuario
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Publication;
