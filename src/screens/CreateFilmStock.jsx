import Input from "../components/Input";
import { Form, useNavigate } from "react-router-dom";

import "./CreateFilmStock.css";
import Modal from "../components/Modal";
import Button from "../components/Button";

export default function CreateFilmStock() {
  const navigate = useNavigate();
  return (
    <Modal title="Add Film Stock" handleClose={() => navigate("..")}>
      <Form method="post" className="CreateFilmStock">
        <Input
          name="name"
          label="Name"
          placeholder="eg. Kodak Gold 200"
          required
        />
        <Button type="submit">Submit</Button>
      </Form>
    </Modal>
  );
}
