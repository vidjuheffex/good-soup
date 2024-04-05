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
import CreateMix from "./screens/CreateMix";
import StockRoot from "./screens/StockRoot";
import RecipeRoot from "./screens/RecipeRoot";
import MixRoot from "./screens/MixRoot";
import ChemistryLayout from "./screens/ChemistryLayout";
import ChemistryIndex from "./screens/ChemistryIndex";

// loader
import getDashboardData from "./loaders/get-dashboard-data";
import getStockRecipes from "./loaders/get-stock-recipes";
import getStockRecipe from "./loaders/get-stock-recipe";
import getChemistry from "./loaders/get-chemistry";
import getMix from "./loaders/get-mix";

// actions
import createChemistryRecipe from "./actions/create-chemistry-recipe";
import createFilmStock from "./actions/create-film-stock";
import createDevelopmentRecipe from "./actions/create-development-recipe";
import createMix from "./actions/create-mix";
import handleRecipeActions from "./actions/handle-recipe-actions";
import deleteMix from "./actions/delete-mix";
import deleteFilmStock from "./actions/delete-film-stock";
import renameFilmStock from "./actions/rename-film-stock";
import renameDevelopmentRecipe from "./actions/rename-development-recipe";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
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
                  path: "create-development-recipe",
                  element: <CreateDevelopmentRecipe />,
                  action: createDevelopmentRecipe,
                },
              ],
            },
            {
              path: "stock/:stockid/:recipeid",
              loader: getStockRecipe,
              action: handleRecipeActions,
              element: <RecipeRoot />,
            },

            {
              path: "chemistry/:chemistryid",
              element: <ChemistryLayout />,
              loader: getChemistry,
              id: "chemistry-route",
              children: [
                {
                  path: "create-mix",
                  action: createMix,
                  element: <CreateMix />,
                },
              ],
            },
            {
              path: "mix/:mixid",
              element: <MixRoot />,
              loader: getMix,
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
            {
              path: "delete-mix",
              action: deleteMix,
            },
            {
              path: "delete-film-stock",
              action: deleteFilmStock,
            },
            {
              path: "rename-film-stock",
              action: renameFilmStock,
            },
            {
              path: "rename-development-recipe",
              action: renameDevelopmentRecipe,
            },
          ],
        },
      ],
    },
  ],
  { basename: "/good-soup/" }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
