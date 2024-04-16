import { getOneFromStore, open, putObjectInStore } from "../db";

export default async (developmentRecipeId, steps) => {
  const db = await open();

  const developmentRecipe = await getOneFromStore(
    db,
    "development-recipes",
    "by_id",
    developmentRecipeId,
  );
  const newDevelopmentRecipe = {
    ...developmentRecipe,
    steps: JSON.parse(steps),
  };
  await putObjectInStore(db, "development-recipes", newDevelopmentRecipe);
  return null;
};
