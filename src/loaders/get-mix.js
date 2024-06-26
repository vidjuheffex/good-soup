import { redirect } from "react-router-dom";
import { open, getOneFromStore } from "../db";

export default async ({ params }) => {
  const db = await open();

  const mix = await getOneFromStore(db, "mixes", "by_id", params.mixid);

  if (!mix) return redirect("/");

   
  const chemistry = await getOneFromStore(
    db,
    "chemistry-recipes",
    "by_id",
    mix.chemistry_id
  );

  mix._chemistry = chemistry;

  return {
    mix,
  };
};
