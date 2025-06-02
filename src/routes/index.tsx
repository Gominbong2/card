import { useRoutes } from "react-router-dom";
import Home from "../pages/home/Home";

const AppRoutes = () => {
  let routes = useRoutes([{ path: "/", element: <Home /> }]);
  return routes;
};
export default AppRoutes;
