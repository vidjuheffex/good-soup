import { redirect } from "react-router-dom";
import { getOneFromStore, open, putObjectInStore } from "../db";
import { createdDateAndShelfLifeToExpirationDate } from "../utils";

export default async ({ request, params }) => {
  const db = await open();

  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const formObject = Object.fromEntries(formData.entries());

      await putObjectInStore(db, "mixes", {
        id: crypto.randomUUID(),
        ...formObject,
        uses: 0,
        createdAt: new Date().toISOString(),
        name: `${formObject["amount"]}ml on ${new Date().toLocaleDateString(
          "en-US"
        )}`,
      });
    }
  }

  return redirect("..");
};
