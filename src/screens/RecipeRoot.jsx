import { useLoaderData } from "react-router-dom";
import Recipe from "./Recipe";

// This essentially only exists to pass a key to a route and force a re-render.

export default () => {
  const data = useLoaderData();

  return (
    <Recipe
      developmentRecipe={data.developmentRecipe}
      key={data.developmentRecipe.id}
    />
  );
};
