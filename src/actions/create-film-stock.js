import { redirect } from "react-router-dom";
import { open, putObjectInStore } from "../db";

export default async ({ request, params }) => {
  const db = await open();

  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const formObject = Object.fromEntries(formData.entries());

      await putObjectInStore(db, "film-stocks", {
        id: crypto.randomUUID(),
        ...formObject,
      });
    }
  }

  return redirect("/");
};
