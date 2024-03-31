import { open, getAllFromStore } from "../db";

export default async ({ params }) => {
  const db = await open();

  return {
    developmentRecipes: params.stockid
      ? await getAllFromStore(
          db,
          "development-recipes",
          "by_filmstock",
          params.stockid
        )
      : [],
  };
};
