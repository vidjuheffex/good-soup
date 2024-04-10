import { Outlet, useLoaderData, NavLink, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./StockRoot.css";
import RenameableTitle from "../components/RenameableTitle";
import Content from "../components/Content";

export default function StockRoot() {
  const data = useLoaderData();
  const navigate = useNavigate();

  return (
    <Content className="StockRoot">
      <RenameableTitle
        title={data.stock.name}
        id={data.stock.id}
        renameAction="/rename-film-stock"
        deleteAction="/delete-film-stock"
      />
      <div>
        <div className="recipesHeading">
          <h2>Recipes</h2>
          <Button
            type="submit"
            onClick={() => navigate("create-development-recipe")}
          >
            Add Recipe
          </Button>
        </div>
        <ul>
          {data.developmentRecipes.map((item) => (
            <li key={item.id}>
              <NavLink className="recipeLink" key={item.id} to={`${item.id}`}>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </Content>
  );
}
