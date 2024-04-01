import Input from "../components/Input";
import {
  Form,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import { useState, useRef } from "react";

import "./CreateDevelopmentRecipe.css";
import Modal from "../components/Modal";
import StepInput from "../components/StepInput";

export default () => {
  const navigate = useNavigate();
  const params = useParams();
  const data = useRouteLoaderData("dashboard");
  const [steps, setSteps] = useState([]);

  const [editingStep, setEditingStep] = useState(null);

  const formRef = useRef();

  const saveStep = (event) => {
    setSteps(
      steps.map((step) => {
        if (step.id == editingStep) {
          return {
            ...step,
            initialAgitation: formRef.current["step-initial-agitation"].value,
            agitationInversions:
              formRef.current["step-agitation-inversions"].value,
            agitationIntervals:
              formRef.current["step-agitation-intervals"].value,
            chemistry: formRef.current["step-chemistry"].value,
            temp: formRef.current["step-temp"].value,
            duration: formRef.current["step-duration"].value,
          };
        } else {
          return step;
        }
      })
    );
    setEditingStep(null);
  };

  const editStep = (id) => {
    setEditingStep(id);
  };

  const addStep = () => {
    const newStepId = crypto.randomUUID();

    setSteps([
      ...steps,
      {
        id: newStepId,
        initialAgitation: null,
        agitationInversions: null,
        agitationIntervals: null,
        chemistry: null,
        temp: null,
        duration: null,
      },
    ]);

    setEditingStep(newStepId);
  };

  return (
    <Modal handleClose={() => navigate("..")}>
      <Form ref={formRef} method="post" className="CreateDevelopmentRecipe">
        <h1>Add Recipe</h1>
        <Input
          name="name"
          label="Name"
          placeholder="eg. Rodinal 1:50"
          required
        />
        <h3>Steps</h3>
        <input type="hidden" name="steps" value={JSON.stringify(steps)} />
        {steps.map((step, index) => {
          return (
            <StepInput
              key={step.id}
              id={step.id}
              index={index + 1}
              editing={step.id == editingStep}
              chemistries={data.chemistryRecipes}
              handleSave={saveStep}
              handleEdit={editStep}
              defaultValues={{
                chemistry: step.chemistry,
                initialAgitation: step.initialAgitation,
                agitationInversions: step.agitationInversions,
                agitationIntervals: step.agitationIntervals,
                temp: step.temp,
                duration: step.duration,
              }}
            />
          );
        })}
        <button type="button" onClick={addStep} disabled={editingStep}>
          Add a step
        </button>
        <button type="submit">Submit</button>
        <input type="hidden" name="filmStockId" value={params?.stockid} />
      </Form>
    </Modal>
  );
};
