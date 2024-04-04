import { getOneFromStore, open, putObjectInStore } from "../db";

export default async ({ request }) => {
  const db = await open();

  const formData = await request.formData();
  const formObject = Object.fromEntries(formData.entries());

  const filmStock = await getOneFromStore(
    db,
    "film-stocks",
    "by_id",
    formObject.id
  );

  filmStock.name = formObject.name;

  await putObjectInStore(db, "film-stocks", filmStock);

  return filmStock.name;
};
