import Input from "../components/Input";
import { Form, useNavigate, useRouteLoaderData } from "react-router-dom";
import { useState } from "react";

import "./EditChemistryMix.css";
import Modal from "../components/Modal";
import Button from "../components/Button";

export default function CreateChemistry() {
  const navigate = useNavigate();
  const data = useRouteLoaderData("chemistry-route");

  const [showReuseOptions, setShowReuseOptions] = useState(
    !data.chemistry.oneShot,
  );

  const handleOneShotChange = (event) => {
    setShowReuseOptions(!event.target.checked);
  };

  return (
    <Modal title="Edit Mix" handleClose={() => navigate("..")}>
      <Form method="post" className="EditChemistryMix">
        <input type="hidden" value={data.chemistry.id} name="id" />
        <Input
          name="ratio"
          label="Chem Ratio"
          placeholder="eg. 1:50"
          pattern="^\d+:\d+$"
          title="Must be in the format of 'a:b'"
          defaultValue={data.chemistry.ratio}
          required
        />
        <Input
          name="temp"
          type="temperature"
          label="Temp"
          placeholder="in Farenheit"
          required
          maxLength={4}
          defaultValue={data.chemistry.temp}
        />
        <Input
          name="oneShot"
          label="One-shot"
          type="checkbox"
          defaultChecked={data.chemistry.oneShot}
          onChange={handleOneShotChange}
        />
        {showReuseOptions && (
          <>
            <Input
              name="shelfLife"
              label="Shelf Life"
              type="duration"
              defaultValue={data.chemistry?.shelfLife}
            />
            <Input
              name="exhaustionRate"
              label="Exhaustion Rate"
              type="text"
              defaultValue={data.chemistry?.exhaustionRate}
              pattern="^\d+s|\d+%"
              title="Must be in the format of 'ns' or 'n%'"
            />
            <Input
              name="maxUses"
              label="Max Uses"
              type="number"
              defaultValue={data.chemistry?.maxUses}
            />
          </>
        )}
        <Button type="submit">Submit</Button>
      </Form>
    </Modal>
  );
}
