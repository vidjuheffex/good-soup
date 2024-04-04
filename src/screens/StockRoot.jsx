import { useEffect, useState } from "react";
import {
  Outlet,
  useLoaderData,
  NavLink,
  Form,
  useFetcher,
} from "react-router-dom";
import SidebarMenu from "../components/SidebarMenu";
import SidebarMenuGroup from "../components/SidebarMenuGroup";
import "./StockRoot.css";

export default function StockRoot() {
  const data = useLoaderData();
  const renameFetcher = useFetcher();
  const [isRenaming, setIsRenaming] = useState(false);

  const toggleRename = () => {
    setIsRenaming(!isRenaming);
  };

  // Reset isRenaming when renameFetcher.data is set
  useEffect(() => {
    if (renameFetcher.data) {
      setIsRenaming(false);
    }
  }, [renameFetcher.data]);

  return (
    <div className="StockRoot">
      <SidebarMenu>
        <div>
          {isRenaming ? (
            <renameFetcher.Form
              className="renameForm"
              method="POST"
              action="/rename-film-stock"
            >
              <input name="name" defaultValue={data.stock.name} autoFocus />
              <input name="id" type="hidden" value={data.stock.id} readOnly />
              <button>ok</button>
            </renameFetcher.Form>
          ) : (
            <h2>{data.stock.name}</h2>
          )}

          <div className="stockControls">
            <button onClick={toggleRename}>
              {isRenaming ? "Cancel" : "Rename"}
            </button>
            <Form
              method="DELETE"
              action="/delete-film-stock"
              onSubmit={(event) => {
                const userconfirm = confirm(
                  "Are you sure you want to delete this film stock? All associated recipes will also be deleted. This action cannot be undone."
                );
                if (!userconfirm) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={data.stock.id} readOnly />
              <button className="delete">Delete</button>
            </Form>
          </div>
        </div>
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
}
