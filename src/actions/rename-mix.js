import { getOneFromStore, open, putObjectInStore } from "../db";

export default async ({ request }) => {
  const db = await open();

  const formData = await request.formData();
  const formObject = Object.fromEntries(formData.entries());

  const mix = await getOneFromStore(db, "mixes", "by_id", formObject.id);

  mix.name = formObject.name;

  await putObjectInStore(db, "mixes", mix);

  return mix.name;
};
