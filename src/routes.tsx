import React from "react";

// Layouts
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import MainLayout from "./components/MainLayout";

// Pages
import Publications from "./pages/Dashboard/Publications";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const routes = [
  {
    path: "authentication",
    children: [],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <DashboardHome />,
      },
      {
        path: "publications",
        element: <Publications />,
      },
    ],
  },
  {
    path: "*",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
