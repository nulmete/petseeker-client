/* eslint-disable camelcase */
import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IPublication } from "../../types/Publication";
import ImageNotFound from "../../assets/imageNotFound.png";

interface Props {
  publication: IPublication;
  distance: number;
  handlePublicationDetail: () => void;
}

const Publication: React.FC<Props> = ({
  publication,
  distance,
  handlePublicationDetail,
}) => {
  const { author_name, pet_name, pub_type, pet_pic_url } = publication;
  const imageToShow = pet_pic_url.length > 0 ? pet_pic_url[0] : ImageNotFound;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Card
      elevation={6}
      onClick={handlePublicationDetail}
      sx={{ cursor: "pointer" }}
    >
      <CardHeader
        sx={{ bgcolor: "secondary.main" }}
        // TODO: remove?
        avatar={<Avatar sx={{ bgcolor: red[500] }}>U</Avatar>}
        title={author_name}
        // TODO: falta timestamp
        subheader="September 14, 2016"
      />
      <CardMedia
        component="img"
        height={matches ? 420 : 280}
        image={imageToShow}
        alt="Publication"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {pub_type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pet_name || "Sin nombre"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Distancia: {distance} km
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Publication;
