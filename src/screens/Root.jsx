import "./Root.css";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="Root">
      <header>
        <h1>Good Soup</h1>
      </header>
      <Outlet></Outlet>
    </div>
  );
}
//
