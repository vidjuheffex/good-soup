import "./Dashboard.css";
import SidebarMenu from "../components/SidebarMenu.jsx";
import SidebarMenuGroup from "../components/SidebarMenuGroup.jsx";

import { useEffect, useRef } from "react";

import {
  Outlet,
  useFetcher,
  useLoaderData,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";

export default () => {
  const data = useLoaderData();
  const params = useParams();
  const fetcher = useFetcher();
  const prevStockId = useRef();

  useEffect(() => {
    if (params.stockid && (prevStockId.current === undefined || prevStockId.current !== params.stockid)) {
      fetcher.load();
    }
    prevStockId.current = params.stockid;
  }, [params.stockid]);

  return (
    <div className="Dashboard">
      <SidebarMenu>
        <SidebarMenuGroup
          title="Chemistry"
          createNewLink="create-chemistry"
          items={data.chemistryRecipes.map((i) => ({ ...i, label: i.name, link: `/chemistry/${i.id}` }))}
        />
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
