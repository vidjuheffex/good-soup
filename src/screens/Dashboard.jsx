import "./Dashboard.css";
import SidebarMenu from "../components/SidebarMenu.jsx";
import SidebarMenuGroup from "../components/SidebarMenuGroup.jsx";

import { Fragment, useEffect, useRef } from "react";

import {
  Outlet,
  useFetcher,
  useLoaderData,
  useParams,
  useRouteLoaderData,
  NavLink,
  Link,
} from "react-router-dom";
import { createdDateAndShelfLifeToExpirationDate } from "../utils.js";

export default () => {
  const data = useLoaderData();
  const params = useParams();
  const fetcher = useFetcher();
  const prevStockId = useRef();

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

  return (
    <div className="Dashboard">
      <SidebarMenu>
        <div className="SidebarMenuGroup">
          <h2 className="title">Chemistry</h2>
          {data.chemistryRecipes.map((recipe) => (
            <Fragment key={recipe.id}>
              <NavLink
                key={recipe.id}
                to={`/chemistry/${recipe.id}/create-mix`}
              >
                {`[+] Mix ${recipe.name}`}
              </NavLink>
              {recipe.mixes.map((mix) => {
                const expired =
                  recipe.shelfLife && createdDateAndShelfLifeToExpirationDate
                    ? new Date(mix.expires) < new Date()
                    : false;
                const exhausted = mix.uses > 0 && recipe.oneShot == true;
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
                    >
                      •
                    </span>
                    <span className="mix-label">{`${mix.name}`}</span>
                  </NavLink>
                );
              })}
            </Fragment>
          ))}
          <Link to={`/create-chemistry`}>[+ Create New]</Link>
        </div>
        <SidebarMenuGroup
          title="Development"
          createNewLink="create-film-stock"
          items={data.filmStocks.map((i) => ({
            ...i,
            label: i.name,
            link: `/stock/${i.id}`,
          }))}
        />
      </SidebarMenu>
      <Outlet />
    </div>
  );
};
