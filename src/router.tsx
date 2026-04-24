import { createBrowserRouter } from "react-router-dom";
import Layout from "./sections/Layout";
import Home from "./sections/Home";
import Textos from "./sections/Textos";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/textos", element: <Textos /> },
      { path: "/meditacoes", element: <div>Meditações em breve...</div> },
      { path: "/sobre", element: <div>Sobre em breve...</div> },
    ],
  },
]);
