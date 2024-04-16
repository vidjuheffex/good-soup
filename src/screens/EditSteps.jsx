import {
  useNavigate,
  useRouteLoaderData,
  useParams,
  Form,
} from "react-router-dom";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { useRef, useState } from "react";
import StepEditor from "../components/StepEditor";
import "./EditSteps.css";

export default function EditSteps() {
  const navigate = useNavigate();
  const { developmentRecipe } = useRouteLoaderData("development-recipe-route");
  const { chemistryRecipes } = useRouteLoaderData("dashboard");

  const formRef = useRef();
  const params = useParams();

  const [editingStep, setEditingStep] = useState(null);

  return (
    <Modal title="Edit Steps" handleClose={() => navigate("..")}>
      <Form ref={formRef} method="post" className="EditSteps" action="..">
        <StepEditor
          steps={developmentRecipe.steps}
          chemistryRecipes={chemistryRecipes}
          form={formRef}
          onEditingStep={(step) => {
            setEditingStep(step);
          }}
        />
        <input
          type="hidden"
          name="development-recipe-id"
          value={params.recipeid}
        />
        <Button
          name="recipe-action"
          type="submit"
          disabled={editingStep}
          value="edit-steps"
        >
          Save
        </Button>
      </Form>
    </Modal>
  );
}
