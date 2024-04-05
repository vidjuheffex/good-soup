import { useRouteLoaderData } from "react-router-dom";

export default function ChemistryIndex() {
  const data = useRouteLoaderData("chemistry-route");

  return (
    <div>
      <h1>Chemistry Index</h1>
    </div>
  );
}
