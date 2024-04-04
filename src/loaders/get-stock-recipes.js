import { open, getAllFromStore, getOneFromStore } from "../db";

export default async ({ params }) => {
  const db = await open();

  return {
    stock: await getOneFromStore(db, "film-stocks", "by_id", params.stockid),
    developmentRecipes: params.stockid
      ? await getAllFromStore(
          db,
          "development-recipes",
          "by_filmstock",
          params.stockid,
        )
      : [],
  };
};
