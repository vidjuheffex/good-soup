import { useLoaderData, Form } from "react-router-dom";
import Content from "../components/Content";
import {
  createdDateAndShelfLifeToExpirationDate,
  shelfLifeToString,
} from "../utils";

import "./MixRoot.css";
import RenameableTitle from "../components/RenameableTitle";

export default () => {
  const { mix } = useLoaderData();

  const data = [
    {Chemistry: mix.chemistry.name}
  ];

  if (mix.notes) {
    data.push({ Notes: mix.notes });
  }

  data.push({ Uses: mix.uses });

  if (!mix.chemistry.oneShot) {
    const expirationDateString = createdDateAndShelfLifeToExpirationDate(
      mix.createdAt,
      mix.chemistry.shelfLife
    ).toLocaleDateString("en-US");
    data.push({ "Expiration Date": expirationDateString });
    data.push({ "Shelf Life": shelfLifeToString(mix.chemistry.shelfLife) });
  }

  return (
    <Content className="MixRoot">
      <RenameableTitle title={mix.name} id={mix.id} renameAction={"/rename-mix"}/ >

      {data.map((item, index) => (
        <div key={index}>
          <h3>{Object.keys(item)[0]}</h3>
          <p>{Object.values(item)[0]}</p>
        </div>
      ))}
      <Form
        method="DELETE"
        action="/delete-mix"
        onSubmit={(event) => {
          const userconfirm = confirm(
            "Are you sure you want to dispose of this mix?"
          );
          if (!userconfirm) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={mix.id} readOnly />
        <button className="dispose">Dispose of Responsibly</button>
      </Form>
    </Content>
  );
};
