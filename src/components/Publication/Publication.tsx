/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Testing purposes
import Dog from "../../assets/dog.jpg";

const Publication: React.FC = () => {
  return (
    <Card sx={{ maxWidth: "60%" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Username"
        subheader="September 14, 2016"
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CardMedia
          component="img"
          height="200"
          image={Dog}
          alt="Dog"
          sx={{ maxWidth: "50%" }}
        />
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
      </Box>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Publication;
