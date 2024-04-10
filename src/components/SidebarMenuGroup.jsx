import { NavLink, Link, useNavigate } from "react-router-dom";
import "./SidebarMenuGroup.css";
import Button from "./Button";

export default ({ title, items, createNewLink, children }) => {
  const navigate = useNavigate()
  return (
    <div className="SidebarMenuGroup">
      <h2 className="title">{title}</h2>
      {children}
      <Button type="submit" onClick={()=>navigate(createNewLink)}>
        Create New
      </Button>
    </div>
  );
};
