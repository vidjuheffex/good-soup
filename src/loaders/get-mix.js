import { open, getOneFromStore } from "../db";

export default async ({ params }) => {
  const db = await open();

  const mix = await getOneFromStore(db, "mixes", "by_id", params.mixid);
  const chemistry = await getOneFromStore(
    db,
    "chemistry-recipes",
    "by_id",
    mix.chemistryId
  );

  mix.chemistry = chemistry;

  return {
    mix,
  };
};
