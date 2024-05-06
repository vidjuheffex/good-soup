import React from "react";
import "./SidebarMenu.css";
import SidebarMenuGroup from "./SidebarMenuGroup";

export default ({ children, className }) => {
  return (
    <div className={`SidebarMenu ${className ? className : ""}`}>
      {children}
    </div>
  );
};
