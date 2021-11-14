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

interface Props {
  handlePublicationDelete: () => Promise<void>;
  handlePublicationDetail: () => void;
}

const Publication: React.FC<Props> = ({
  handlePublicationDelete,
  handlePublicationDetail,
}) => {
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
          Nombre mascota
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tipo publicacion
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Distancia mascota - usuario
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Publication;
