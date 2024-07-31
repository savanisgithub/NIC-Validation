import { Outlet } from "react-router-dom";
import Navigation from "../Shared/Navigation";

function MainLayout() {
  return (
    <div>
        <Navigation/>
        <Outlet/>
    </div>
  )
}

export default MainLayout;