import { open, getOneFromStore } from "../db";

export default async ({ params }) => {
  const db = await open();
  return {
    chemistry: await getOneFromStore(
      db,
      "chemistry-recipes",
      "by_id",
      params.chemistryid
    ),
  };
};
