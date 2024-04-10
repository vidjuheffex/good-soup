import { getOneFromStore, open, putObjectInStore } from "../db";

export default async ({ request }) => {
  const db = await open();

  const formData = await request.formData();
  const formObject = Object.fromEntries(formData.entries());

  const recipe = await getOneFromStore(
    db,
    "chemistry-recipes",
    "by_id",
    formObject.id,
  );

  recipe.name = formObject.name;

  await putObjectInStore(db, "chemistry-recipes", recipe);

  return recipe.name;
};
