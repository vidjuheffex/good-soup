import { redirect } from "react-router-dom";
import { open, putObjectInStore } from "../db";

export default async ({ request, params }) => {
  const db = await open();

  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const formObject = Object.fromEntries(formData.entries());

      formObject.oneShot = formObject?.oneShot === "on";
      formObject.temp = parseInt(formObject.temp, 10);

      await putObjectInStore(db, "chemistry-recipes", {
        id: crypto.randomUUID(),
        ...formObject,
      });
    }
  }

  return redirect("/");
};
