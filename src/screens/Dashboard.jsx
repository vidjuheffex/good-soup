import "./Dashboard.css";
import SidebarMenu from "../components/SidebarMenu.jsx";
import SidebarMenuGroup from "../components/SidebarMenuGroup.jsx";

import { useEffect, useRef } from "react";

import {
  Outlet,
  useFetcher,
  useLoaderData,
  useParams,
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";
import { createdDateAndShelfLifeToExpirationDate } from "../utils.js";

export default () => {
  const data = useLoaderData();
  const params = useParams();
  const fetcher = useFetcher();
  const prevStockId = useRef();
  const location = useLocation();

  useEffect(() => {
    if (
      params.stockid &&
      (prevStockId.current === undefined ||
        prevStockId.current !== params.stockid)
    ) {
      fetcher.load();
    }
    prevStockId.current = params.stockid;
  }, [params.stockid]);

  const sidebarClass = location.pathname === "/" ? "" : "sidebar-hidden";

  return (
    <div className="Dashboard">
      <SidebarMenu className={sidebarClass}>
        <SidebarMenuGroup title="Chemistry" createNewLink="create-chemistry">
          {data.chemistryRecipes.map((recipe) => {
            if (recipe.id == "_WATER_") {
              return null;
            }
            return (
              <div className="chemistryGroup" key={recipe.id}>
                <NavLink key={recipe.id} to={`/chemistry/${recipe.id}`}>
                  {`${recipe.name}`}
                </NavLink>

                {recipe.mixes.map((mix) => {
                  const expired =
                    recipe?.shelfLife && createdDateAndShelfLifeToExpirationDate
                      ? new Date(mix.expires) < new Date()
                      : false;
                  const exhausted =
                    (mix?.uses > 0 && recipe.oneShot == true) ||
                    mix?.uses >= recipe.maxUses;
                  return (
                    <NavLink
                      key={mix.id}
                      to={`/mix/${mix.id}`}
                      className="mix-entry"
                    >
                      <span
                        className={`bullet ${
                          expired || exhausted ? "bad" : "okay"
                        }`}
                      ></span>
                      <span className="mix-label">{`${mix.name}`}</span>
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </SidebarMenuGroup>
        <SidebarMenuGroup title="Development" createNewLink="create-film-stock">
          {data.filmStocks.map((item) => (
            <NavLink key={item.id} to={`/stock/${item.id}`}>
              {item.name}
            </NavLink>
          ))}
        </SidebarMenuGroup>
        <Link to="/settings" className="settingsLink">
          <span>Settings</span>
          <span>⚙</span>
        </Link>
      </SidebarMenu>
      <Outlet />
    </div>
  );
};
