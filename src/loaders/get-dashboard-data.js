import { open, getAllFromStore } from "../db";

export default async ({ params }) => {
  const db = await open();
  const chemistryRecipes = await getAllFromStore(db, "chemistry-recipes");
  const filmStocks = await getAllFromStore(db, "film-stocks");
  const chemistryRecipesWithMixes = Promise.all(
    chemistryRecipes.map(async (chemistryRecipe) => {
      return {
        ...chemistryRecipe,
        mixes: await getAllFromStore(
          db,
          "mixes",
          "by_chemistry",
          chemistryRecipe.id
        ),
      };
    })
  );

  return {
    chemistryRecipes: await chemistryRecipesWithMixes,
    filmStocks,
  };
};
