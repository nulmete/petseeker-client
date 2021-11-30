import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutButton from "../Auth/LogoutButton";
import PetSeeker from "../../assets/petseeker.png";
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
    <div>
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
    </div>
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
                src={PetSeeker}
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
          background: "red",
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
