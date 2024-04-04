import { redirect } from "react-router-dom";
import { deleteObjectFromStore, open } from "../db";

export default async function ({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData.entries());

  const db = await open();

  await deleteObjectFromStore(db, "mixes", formObject.id);

  return redirect("/");
}
