import { getOneFromStore, open, putObjectInStore } from "../db";
import { durationToSeconds } from "../utils";

export default async (developmentRecipeId, steps) => {
  const db = await open();

  const developmentRecipe = await getOneFromStore(
    db,
    "development-recipes",
    "by_id",
    developmentRecipeId,
  );

  const parsedSteps = JSON.parse(steps).map((step) => ({
    ...step,
    duration: durationToSeconds(step.duration),
    agitationIntervals: durationToSeconds(step.agitationIntervals),
    temp: parseInt(step.temp, 10),
    agitationTime: durationToSeconds(step.agitationTime),
    initialAgitation: durationToSeconds(step.initialAgitation),
  }));

  const newDevelopmentRecipe = {
    ...developmentRecipe,
    steps: parsedSteps,
  };

  await putObjectInStore(db, "development-recipes", newDevelopmentRecipe);
  return null;
};
