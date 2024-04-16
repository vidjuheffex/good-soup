import { getOneFromStore, open, putObjectInStore } from "../db";

export default async (mixid) => {
  const db = await open();

  const mix = await getOneFromStore(db, "mixes", "by_id", mixid);
  const newMix = {...mix, uses: mix.uses + 1}
  await putObjectInStore(db, "mixes", newMix);
  return null;
};
