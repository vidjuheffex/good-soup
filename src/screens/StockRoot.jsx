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
import RenameableTitle from "../components/RenameableTitle";

export default function StockRoot() {
  const data = useLoaderData();

  return (
    <div className="StockRoot">
      <SidebarMenu>
        <div className="controls">
          <RenameableTitle
            title={data.stock.name}
            id={data.stock.id}
            action="/rename-film-stock"
          />
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
