import { open, getAllFromStore } from "../db";

export default async ({params}) => {
  const db = await open();

  console.log("loader running")

  return {
    chemistryRecipes: await getAllFromStore(db, "chemistry-recipes"),
    developmentRecipes: params.stockid ? await getAllFromStore(db, "development-recipes","by_filmstock",params.stockid  ) : [],
    filmStocks: await getAllFromStore(db, "film-stocks"),
  };
};
