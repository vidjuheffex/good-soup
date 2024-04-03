import consumeMix from "./consume-mix";

export default async function ({ request, params }) {
  const data = Object.fromEntries(await request.formData());

  if (data.action) {
    switch (data.action) {
      case "consume-mix": {
        return await consumeMix(data.mix);
      }
    }
  }
  return null;
}
