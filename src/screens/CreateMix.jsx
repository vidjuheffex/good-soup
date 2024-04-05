import { useState } from "react";
import { Form, useRouteLoaderData, useNavigate } from "react-router-dom";
import "./CreateMix.css";
import Modal from "../components/Modal";
import Input from "../components/Input";

export default function CreateMix() {
  const navigate = useNavigate();
  const { chemistry } = useRouteLoaderData("chemistry-route");

  // State to store the input amount and calculated amounts
  const [amount, setAmount] = useState("");
  const [chemAmount, setChemAmount] = useState(0);
  const [waterAmount, setWaterAmount] = useState(0);

  // Handle input change
  const handleInputChange = (e) => {
    const inputAmount = e.target.value;
    setAmount(inputAmount);
    if (inputAmount) {
      calculateAmounts(inputAmount, chemistry.ratio);
    } else {
      // Reset amounts if the input is cleared
      setChemAmount(0);
      setWaterAmount(0);
    }
  };

  // Function to calculate the amounts of chemicals and water
  const calculateAmounts = (inputAmount, ratio) => {
    const [chemRatio, waterRatio] = ratio.split(":").map(Number);
    const totalParts = chemRatio + waterRatio;
    const totalAmount = Number(inputAmount);
    const chems = (totalAmount * chemRatio) / totalParts;
    const water = (totalAmount * waterRatio) / totalParts;

    setChemAmount(chems);
    setWaterAmount(water);
  };

  return (
    <Modal handleClose={() => navigate("..")}>
      <Form method="post">
        <h1>Create Mix</h1>
        <Input
          type="number"
          name="amount"
          label="amount"
          placeholder="amount in ml"
          required
          value={amount}
          onChange={handleInputChange}
        />
        <input type="hidden" value={chemistry.id} name="chemistryId" readOnly />
        {amount && (
          <div>
            <p>Chemicals Needed: {chemAmount.toFixed(2)} ml</p>
            <p>Water Needed: {waterAmount.toFixed(2)} ml</p>
          </div>
        )}
        <div>{`Mix at ${chemistry.temp} Farenheit`}</div>
        <hr />
        <button type="submit">Mix</button>
      </Form>
    </Modal>
  );
}
