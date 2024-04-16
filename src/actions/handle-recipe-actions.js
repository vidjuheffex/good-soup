import editSteps from "./edit-steps";
import consumeMix from "./consume-mix";

export default async function ({ request, params }) {
  const data = Object.fromEntries(await request.formData());

  if (data["recipe-action"]) {
    switch (data["recipe-action"]) {
      case "edit-steps":
        return await editSteps(data["development-recipe-id"], data.steps);
      case "consume-mix":
        return await consumeMix(data.mix);
    }
  }

  return null;
}
