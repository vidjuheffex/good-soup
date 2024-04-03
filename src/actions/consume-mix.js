import { getOneFromStore, open, putObjectInStore } from "../db";

export default async (mixid) => {
  const db = await open();

  const mix = await getOneFromStore(db, "mixes", "by_id", mixid);
  mix.uses += 1;
  await putObjectInStore(db, "mixes", mix);
  return null;
};
