import { redirect } from "react-router-dom";
import { getOneFromStore, open, putObjectInStore } from "../db";

export default async ({ request }) => {
  const db = await open();

  const formData = await request.formData();
  const formObject = Object.fromEntries(formData.entries());

  const recipe = await getOneFromStore(
    db,
    "chemistry-recipes",
    "by_id",
    formObject.id,
  );

  if (formObject.notes) {
    await putObjectInStore(db, "chemistry-recipes", {
      ...recipe,
      notes: formObject.notes,
    });
    return formObject.notes;
  } else {
    if (formObject.oneShot) {
      formObject.maxUses = "";
      formObject.shelfLife = "";
      formObject.exhaustionRate = "";
    }

    await putObjectInStore(db, "chemistry-recipes", {
      ...recipe,
      ...formObject,
      oneShot: !!formObject.oneShot,
    });
    return redirect("..");
  }
};
