import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import EditChemistryMix from "./screens/EditChemistryMix";
import Settings from "./screens/Settings";
import EditSteps from "./screens/EditSteps";

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
import deleteDevelopmentRecipe from "./actions/delete-development-recipe";
import renameChemistryRecipe from "./actions/rename-chemistry-recipe";
import deleteChemistryRecipe from "./actions/delete-chemistry-recipe";
import renameMix from "./actions/rename-mix";
import updateChemistryRecipe from "./actions/update-chemistry-recipe";

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
              id: 'development-recipe-route',
              children: [
                {
                  path: "edit-steps",
                  element: <EditSteps />
                }
              ]
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
                {
                  path: "edit-chemistry-mix",
                  action: updateChemistryRecipe,
                  element: <EditChemistryMix />,
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
          ],
        },

        {
          path: "settings",
          element: <Settings />,
        },

        // action (api) routes
        // Todo:
        // - cleanup, eg: 'delete-mix' can re-use 'mix' but look for "method is DELETE"
        // - consolidate, eg: rename is update with a value on submit to differentiate 
        {
          path: "delete-mix",
          action: deleteMix,
        },
        {
          path: "delete-film-stock",
          action: deleteFilmStock,
        },
        {
          path: "delete-chemistry-recipe",
          action: deleteChemistryRecipe,
        },
        {
          path: "delete-development-recipe",
          action: deleteDevelopmentRecipe,
        },
        {
          path: "rename-film-stock",
          action: renameFilmStock,
        },
        {
          path: "rename-development-recipe",
          action: renameDevelopmentRecipe,
        },
        {
          path: "rename-chemistry-recipe",
          action: renameChemistryRecipe,
        },
        {
          path: "update-chemistry-recipe",
          action: updateChemistryRecipe,
        },
        {
          path: "rename-mix",
          action: renameMix,
        },
      ],
    },
  ],

  { basename: "/good-soup/" },
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
