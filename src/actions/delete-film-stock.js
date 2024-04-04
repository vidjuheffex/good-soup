import { redirect } from "react-router-dom";
import { deleteObjectAndDependentsFromStore, open } from "../db";

export default async function ({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData.entries());

  const db = await open();

  await deleteObjectAndDependentsFromStore(db, "film-stocks", formObject.id, {
    "development-recipes": "by_filmstock",
  });

  return redirect("/");
}
