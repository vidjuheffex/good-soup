import { redirect } from "react-router-dom";
import { deleteObjectAndDependentsFromStore, open } from "../db";

export default async function ({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData.entries());

  const db = await open();

  await deleteObjectAndDependentsFromStore(
    db,
    "chemistry-recipes",
    formObject.id,
    {
      mixes: "by_chemistry",
    },
  );

  return redirect("/");
}
