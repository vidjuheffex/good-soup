import { open, getOneFromStore } from "../db";
export default async ({ params }) => {
  const db = await open();

  const developmentRecipe = await getOneFromStore(
    db,
    "development-recipes",
    "by_id",
    params.recipeid
  );

  const chemistryIds = developmentRecipe.steps.map((step) => step.chemistry);
  const chemistryRecipes = await Promise.all(
    chemistryIds.map((id) =>
      getOneFromStore(db, "chemistry-recipes", "by_id", id)
    )
  );
  developmentRecipe.steps = developmentRecipe.steps.map((step) => ({
    ...step,
    chemistry: chemistryRecipes.find((recipe) => recipe.id === step.chemistry),
  }));

  return {
    developmentRecipe,
  };
};
