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
          {data.chemistryRecipes.map((item) => (
            <Fragment key={item.id}>
              <NavLink key={item.id} to={`/chemistry/${item.id}/create-mix`}>
                {`Mix ${item.name}`}
              </NavLink>
              {item.mixes.map((mix) => (
                <NavLink
                  key={mix.id}
                  to={`/mix/${mix.id}`}
                  className="mix-entry"
                >
                  <span className="bullet okay">•</span>
                  <span>{`${mix.name}`}</span>
                </NavLink>
              ))}
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
