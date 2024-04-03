import { Outlet, useLoaderData, NavLink } from "react-router-dom";
import SidebarMenu from "../components/SidebarMenu";
import SidebarMenuGroup from "../components/SidebarMenuGroup";
import "./StockRoot.css";

export default () => {
  const data = useLoaderData();

  return (
    <div className="StockRoot">
      <SidebarMenu>
        <SidebarMenuGroup
          title="Recipes"
          createNewLink="create-development-recipe"
        >
          {data.developmentRecipes.map((item) => (
            <NavLink key={item.id} to={`${item.id}`}>
              {item.name}
            </NavLink>
          ))}
        </SidebarMenuGroup>
      </SidebarMenu>
      <Outlet />
    </div>
  );
};
