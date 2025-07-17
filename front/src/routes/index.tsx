import { useRoutes } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
  ]);
  return routes;
};
export default AppRoutes;
