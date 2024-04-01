import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";

// screens
import Dashboard from "./screens/Dashboard";
import Root from "./screens/Root";
import CreateChemistry from "./screens/CreateChemistry";
import CreateFilmStock from "./screens/CreateFilmStock";
import CreateDevelopmentRecipe from "./screens/CreateDevelopmentRecipe";
import StockRoot from "./screens/StockRoot";
import RecipeRoot from "./screens/RecipeRoot";

// loader
import getDashboardData from "./loaders/get-dashboard-data";
import getStockRecipes from "./loaders/get-stock-recipes";
import getStockRecipe from "./loaders/get-stock-recipe";

// actions
import createChemistryRecipe from "./actions/create-chemistry-recipe";
import createFilmStock from "./actions/create-film-stock";
import createDevelopmentRecipe from "./actions/create-development-recipe";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    loader: getDashboardData,
    id: "dashboard",
    children: [
      {
        path: "stock/:stockid",
        element: <StockRoot />,
        loader: getStockRecipes,
        id: "stock-route",
        children: [
          {
            path: ":recipeid",
            loader: getStockRecipe,
            element: <RecipeRoot />,
          },
          {
            path: "create-development-recipe",
            element: <CreateDevelopmentRecipe />,
            action: createDevelopmentRecipe,
          },
        ],
      },
      {
        path: "chemistry/:chemistryid",
        element: <div>a chem</div>,
      },
      {
        path: "create-chemistry",
        element: <CreateChemistry />,
        action: createChemistryRecipe,
      },
      {
        path: "create-film-stock",
        element: <CreateFilmStock />,
        action: createFilmStock,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
