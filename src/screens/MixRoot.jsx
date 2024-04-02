import { useLoaderData } from "react-router-dom";
import Content from "../components/Content";
import { shelfLifeToSeconds } from "../utils";

export default () => {
  const { mix } = useLoaderData();

  const data = [];

  if (!mix.chemistry.oneShot) {
    data.push({ Uses: mix.uses });

    // Calculate the expiration date
    const shelfLifeInSeconds = shelfLifeToSeconds(mix.chemistry.shelfLife);
    const createdAtDate = new Date(mix.createdAt);
    const expirationDate = new Date(
      createdAtDate.getTime() + shelfLifeInSeconds * 1000
    );
    const expirationDateString = expirationDate.toLocaleDateString("en-US");
    data.push({ "Expiration Date": expirationDateString });
  }

  return (
    <Content className="Content">
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
