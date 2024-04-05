import { Link, Outlet, useRouteLoaderData } from "react-router-dom";

export default function ChemistryLayout() {
  const data = useRouteLoaderData("chemistry-route");

  const { chemistry, mixes } = data;

  return (
    <div>
      <h1>{chemistry.name}</h1>
      <h2>Notes</h2>
      <div>{chemistry.notes || "No notes available"}</div>
      <h2>Mixing Details</h2>
      {chemistry.oneShot || (
        <>
          <div>Exhaustion Rate: {chemistry.exhaustionRate}</div>
          <div>Shelf Life: {chemistry.shelfLife}</div>
        </>
      )}
      <div>Temperature: {chemistry.temp}°</div>
      <div>Ratio: {chemistry.ratio}</div>
      <div>One Shot: {chemistry.oneShot ? "Yes" : "No"}</div>
      <h2>Mixes</h2>
      <Link to="create-mix">[Create Mix]</Link>

      {mixes.length ? (
        <ul>
          {mixes.map((mix) => (
            <li key={mix.id}>
              <Link to={`/mix/${mix.id}`}>{mix.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>No mixes available</div>
      )}
      <Outlet />
    </div>
  );
}
