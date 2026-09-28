import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Layout from "@/components/Layout";
import Login from "@/routes/Login";
import Home from "@/routes/Home";
import Flow from "@/routes/Flow";
import Reveal from "@/routes/Reveal";
import Saved from "@/routes/Saved";
import Closet from "@/routes/Closet";
import Profile from "@/routes/Profile";
import { Toaster } from "@/components/ui/sonner";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/style", element: <Flow /> },
      { path: "/reveal", element: <Reveal /> },
      { path: "/saved", element: <Saved /> },
      { path: "/closet", element: <Closet /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>
);
