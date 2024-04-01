import { Outlet, useLoaderData } from "react-router-dom";
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
          items={data.developmentRecipes.map((i) => ({
            ...i,
            label: i.name,
            link: `${i.id}`,
          }))}
        ></SidebarMenuGroup>
      </SidebarMenu>
      <Outlet />
    </div>
  );
};
