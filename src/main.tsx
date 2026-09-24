import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "@/routes/Home";
import Flow from "@/routes/Flow";
import Reveal from "@/routes/Reveal";
import Saved from "@/routes/Saved";
import { Toaster } from "@/components/ui/sonner";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/style", element: <Flow /> },
  { path: "/reveal", element: <Reveal /> },
  { path: "/saved", element: <Saved /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>
);
