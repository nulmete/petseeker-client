import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Button,
} from "@mui/material";
import LogoutButton from "../Auth/LogoutButton";
import PetSeeker from "../../assets/petseeker.png";
import PetSeeker2 from "../../assets/petseeker2.png";
import Patita from "../../assets/patita.png";

const sections = [
  {
    title: "Publicaciones",
    path: "/dashboard/publicaciones",
  },
  {
    title: "Perfil",
    path: "/dashboard/perfil",
  },
];

interface Props {
  drawerWidth: number;
}

const Sidebar: React.FC<Props> = ({ drawerWidth = 240 }) => {
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <img
          src={PetSeeker}
          alt="PetSeeker"
          style={{ maxWidth: "140px", display: "block" }}
        />
      </Toolbar>
      <Divider />
      <List>
        {sections.map(({ title, path }) => (
          <ListItem key={title} disableGutters>
            <Button
              component={RouterLink}
              to={path}
              variant="text"
              color="primary"
              sx={{ width: "100%" }}
            >
              {title}
            </Button>
          </ListItem>
        ))}
        <ListItem disableGutters>
          <LogoutButton />
        </ListItem>
      </List>
      <div
        style={{
          marginTop: "auto",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={Patita} style={{ display: "block", height: "75px" }} alt="" />
      </div>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "primary.main",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <div>
              <img
                src={PetSeeker2}
                style={{ display: "block", height: "35px" }}
                alt=""
              />
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "secondary.main",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "secondary.main",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
