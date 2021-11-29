/* eslint-disable camelcase */
import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { IPublication } from "../../types/Publication";
import ImageNotFound from "../../assets/imageNotFound.png";

interface Props {
  publication: IPublication;
  handlePublicationDetail: () => void;
}

const Publication: React.FC<Props> = ({
  publication,
  handlePublicationDetail,
}) => {
  const { author_name, pet_name, pub_type, pet_pic_url } = publication;
  const imageToShow = pet_pic_url.length > 0 ? pet_pic_url[0] : ImageNotFound;

  return (
    <Card onClick={handlePublicationDetail} sx={{ cursor: "pointer" }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: red[500] }}>U</Avatar>}
        title={author_name}
        // TODO: falta timestamp
        subheader="September 14, 2016"
      />
      <CardMedia component="img" height="220" image={imageToShow} alt="Dog" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {pet_name || "Sin nombre"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pub_type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {/* TODO: calcular */}
          Distancia mascota - usuario
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Publication;
