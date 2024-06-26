import { open, getOneFromStore, getAllFromStore } from "../db";

export default async ({ params }) => {
  const db = await open();

  // Get the recipe
  const developmentRecipe = await getOneFromStore(
    db,
    "development-recipes",
    "by_id",
    params.recipeid,
  );

  // Get the chemistry recipes that the steps use
  const chemistryIds = developmentRecipe.steps.map((step) => step.chemistry_id);
  let chemistryRecipes = await Promise.all(
    chemistryIds.map((id) =>
      getOneFromStore(db, "chemistry-recipes", "by_id", id),
    ),
  );

  // Append any available mixes to the chemistry recipes
  chemistryRecipes = await Promise.all(
    chemistryRecipes.map(async (recipe) => ({
      ...recipe,
      mixes: await getAllFromStore(db, "mixes", "by_chemistry", recipe.id),
    })),
  );

  // append the receipe with full chemistry recipe
  developmentRecipe.steps = developmentRecipe.steps.map((step) => ({
    ...step,
    _chemistry: chemistryRecipes.find(
      (recipe) => recipe.id === step.chemistry_id,
    ),
  }));

  return {
    developmentRecipe,
  };
};
