import Input from "../components/Input";
import Button from "../components/Button";
import {
  Form,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import { useState, useRef } from "react";

import "./CreateDevelopmentRecipe.css";
import Modal from "../components/Modal";
import StepEditor from "../components/StepEditor";

export default function CreateDevelopmentRecipe() {
  const navigate = useNavigate();
  const params = useParams();
  const data = useRouteLoaderData("dashboard");
  const [steps, setSteps] = useState([]);

  const [editingStep, setEditingStep] = useState(null);

  const formRef = useRef();

  const editStep = (id) => {
    setEditingStep(id);
  };

  return (
    <Modal title="Add Recipe" handleClose={() => navigate("..")}>
      <Form ref={formRef} method="post" className="CreateDevelopmentRecipe">
        <Input
          name="name"
          label="Name"
          placeholder="eg. Rodinal 1:50"
          required
        />
        <div className="stepsSection">
          <h3>Steps</h3>
          <StepEditor
            steps={steps}
            chemistryRecipes={data.chemistryRecipes}
            form={formRef}
            onEdit={editStep}
          />
        </div>
        <Button type="submit" disabled={editingStep}>
          Submit
        </Button>
        <input
          readOnly
          type="hidden"
          name="filmstock_id"
          value={params?.stockid}
        />
      </Form>
    </Modal>
  );
}
