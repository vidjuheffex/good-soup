import { useLoaderData } from "react-router-dom";
import Recipe from "./Recipe";
//import "./RecipeRoot.css";

export default () => {
  const data = useLoaderData();

  return (
    <Recipe
      developmentRecipe={data.developmentRecipe}
      key={data.developmentRecipe.id}
    />
  );
};
