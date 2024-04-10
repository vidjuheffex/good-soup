import "./Root.css";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="Root">
      <header>
        <h1>Good Soup</h1><a href="" className="version">(v0.1.0-rc17)</a>
      </header>
      <Outlet></Outlet>
    </div>
  );
}
//
