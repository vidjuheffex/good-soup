import { useLoaderData } from "react-router-dom";
import Content from "../components/Content";
import {
  createdDateAndShelfLifeToExpirationDate,
  shelfLifeToString,
} from "../utils";

export default () => {
  const { mix } = useLoaderData();

  const data = [];

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
    <Content>
      <h1>{mix.chemistry.name}</h1>
      <h2>{mix.name}</h2>
      <hr style={{ width: "100%" }} />
      {data.map((item, index) => (
        <div key={index}>
          <h3>{Object.keys(item)[0]}</h3>
          <p>{Object.values(item)[0]}</p>
        </div>
      ))}
    </Content>
  );
};
