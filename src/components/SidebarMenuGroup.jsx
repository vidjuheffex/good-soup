import { NavLink, Link } from "react-router-dom";
import "./SidebarMenuGroup.css";

export default ({ title, items, createNewLink }) => {
  return (
    <div className="SidebarMenuGroup">
      <h2 className="title">{title}</h2>
      {items.map((item) => (
        <NavLink key={item.id} to={item.link}>
          {item.label}
        </NavLink>
      ))}
      <Link to={createNewLink}>[+ Create New]</Link>
    </div>
  );
};
