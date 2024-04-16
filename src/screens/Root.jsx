import "./Root.css";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="Root">
      <Outlet></Outlet>
    </div>
  );
}
//
