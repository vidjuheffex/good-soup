import { open, getAllFromStore } from "../db";

export default async ({ params }) => {
  const db = await open();

  return {
    chemistryRecipes: await getAllFromStore(db, "chemistry-recipes"),
    filmStocks: await getAllFromStore(db, "film-stocks"),
  };
};
