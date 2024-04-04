import Input from "../components/Input";
import { Form, useNavigate } from "react-router-dom";
import { useState } from "react";

import "./CreateChemistry.css";
import Modal from "../components/Modal";

export default function CreateChemistry() {
  const navigate = useNavigate();
  const [showReuseOptions, setShowReuseOptions] = useState(false);

  const handleOneShotChange = (event) => {
    setShowReuseOptions(!event.target.checked);
  };

  return (
    <Modal handleClose={() => navigate("..")}>
      <Form method="post">
        <h1>Create New Chemistry Recipe</h1>
        <Input
          name="name"
          label="Name"
          placeholder="eg. Rodinal 1:50"
          required
        />
        <Input
          name="ratio"
          label="Chem Ratio"
          placeholder="eg. 1:50"
          pattern="^\d+:\d+$"
          title="Must be in the format of 'a:b'"
          required
        />
        <Input
          name="temp"
          type="number"
          label="Temp"
          placeholder="in Farenheit"
          required
        />
        <Input
          name="oneShot"
          label="One-shot"
          type="checkbox"
          defaultChecked={true}
          onChange={handleOneShotChange}
        />
        {showReuseOptions && (
          <>
            <Input
              name="shelfLife"
              label="Shelf Life"
              type="duration"
              required
            />
            <Input
              name="exhuastionRate"
              label="Exhaustion Rate"
              type="text"
              pattern="^\d+s|\d+%"
              title="Must be in the format of 'ns' or 'n%'"
              required
            />
          </>
        )}

        <Input
          name="notes"
          label="Notes"
          type="textarea"
          placeholder="eg. One-shot but can be used up to 8x with increased 10% dev times."
        />
        <button type="submit">Submit</button>
      </Form>
    </Modal>
  );
}
