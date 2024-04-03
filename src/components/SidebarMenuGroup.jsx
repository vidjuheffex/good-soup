import { NavLink, Link } from "react-router-dom";
import "./SidebarMenuGroup.css";

export default ({ title, items, createNewLink, children }) => {
  return (
    <div className="SidebarMenuGroup">
      <h2 className="title">{title}</h2>
      {children}
      <Link className="createLink" to={createNewLink}>
        [+ Create New]
      </Link>
    </div>
  );
};
