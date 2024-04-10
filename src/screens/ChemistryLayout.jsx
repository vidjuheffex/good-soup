import {
  Link,
  Outlet,
  useRouteLoaderData,
  useNavigate,
} from "react-router-dom";
import Content from "../components/Content";
import RenameableTitle from "../components/RenameableTitle";
import Button from "../components/Button";
import "./ChemistryLayout.css";
import Notes from "../components/Notes";

export default function ChemistryLayout() {
  const data = useRouteLoaderData("chemistry-route");
  const navigate = useNavigate();

  const { chemistry, mixes } = data;

  return (
    <Content className="ChemistryLayout" key={chemistry.id}>
      <RenameableTitle
        title={chemistry.name}
        id={chemistry.id}
        renameAction={"/rename-chemistry-recipe"}
        deleteAction={"/delete-chemistry-recipe"}
      />
      <div className="section">
        <Notes
          notes={chemistry.notes}
          id={chemistry.id}
          updateUrl="/update-chemistry-recipe"
        />
      </div>
      <div>
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
      </div>
      <div>
        <div className="mixesHeader">
          <h2>Mixes</h2>
          <Button type="submit" onClick={() => navigate("create-mix")}>
            Create Mix
          </Button>
        </div>
        {mixes.length ? (
          <ul className="mixesList">
            {mixes.map((mix) => (
              <li key={mix.id}>
                <Link to={`/mix/${mix.id}`}>{mix.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>No mixes available</div>
        )}
      </div>
      <Outlet />
    </Content>
  );
}
