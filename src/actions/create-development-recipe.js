import { redirect } from "react-router-dom";
import { open, putObjectInStore } from "../db";
import { durationToSeconds } from "../utils";

export default async ({ request, params }) => {
  const db = await open();

  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const formObject = Object.fromEntries(formData.entries());

      formObject["steps"] = JSON.parse(formObject["steps"]);

      formObject["steps"] = formObject["steps"].map((step) => {
        step["duration"] = durationToSeconds(step["duration"]);
        step["agitationIntervals"] = durationToSeconds(
          step["agitationIntervals"]
        );
        step["temp"] = parseInt(step["temp"], 10);
        step["agitationInversions"] = parseInt(step["agitationInversions"], 10);
        step["initialAgitation"] = durationToSeconds(step["initialAgitation"]);

        return step;
      });

      await putObjectInStore(db, "development-recipes", {
        id: crypto.randomUUID(),
        ...formObject,
      });
    }
  }

  return redirect("..");
};
