import Input from "../components/Input";
import { Form, useNavigate } from "react-router-dom";

import "./CreateFilmStock.css";
import Modal from "../components/Modal";

export default () => {
  const navigate = useNavigate();
  return (
    <Modal handleClose={() => navigate("/")}>
      <Form method="post">
        <h1>Add Film Stock</h1>
        <Input
          name="name"
          label="Name"
          placeholder="eg. Kodak Gold 200"
          required
        />
        <button type="submit">Submit</button>
      </Form>
    </Modal>
  );
};
