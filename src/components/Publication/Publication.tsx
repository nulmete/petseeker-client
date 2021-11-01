/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Testing purposes
import Dog from "../../assets/dog.jpg";

const options = ["Delete", "Action 2"];
const ITEM_HEIGHT = 48;

interface Props {
  handlePublicationDelete: () => Promise<void>;
}

const Publication: React.FC<Props> = ({ handlePublicationDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            U
          </Avatar>
        }
        action={
          <>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={() => {
                    handlePublicationDelete();
                    handleClose();
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </>
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
          sx={{ maxWidth: "25%" }}
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
    </Card>
  );
};

export default Publication;
