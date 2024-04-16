import { useState, useEffect } from "react";
import Button from "./Button";
import StepInput from "./StepInput";

export default function StepEditor({
  steps: defaultSteps,
  chemistryRecipes,
  form,
  onEditingStep,
}) {
  const [steps, setSteps] = useState(defaultSteps);
  const [editingStep, setEditingStep] = useState(null);

  const addStep = () => {
    const newStepId = crypto.randomUUID();

    setSteps([
      ...steps,
      {
        __unsaved__: true,
        id: newStepId,
        initialAgitation: null,
        agitationTime: null,
        agitationIntervals: null,
        chemistry: null,
        temp: null,
        duration: null,
      },
    ]);

    setEditingStep(newStepId);
  };

  const editStep = (id) => {
    if (editingStep) {
      cancelStep();
    }
    setEditingStep(id);
  };

  const saveStep = (event) => {
    setSteps(
      steps.map((step) => {
        if (step.id == editingStep) {
          const { __unsaved__, ...savedStep } = step;
          return {
            ...savedStep,
            initialAgitation: form.current["step-initial-agitation"].value,
            agitationTime: form.current["step-agitation-time"].value,
            agitationIntervals: form.current["step-agitation-intervals"].value,
            chemistry_id: form.current["step-chemistry-id"].value,
            temp: form.current["step-temp"].value,
            duration: form.current["step-duration"].value,
          };
        } else {
          return step;
        }
      }),
    );
    setEditingStep(null);
  };

  const cancelStep = () => {
    // if this step has __unsaved__ true then we remove it, otherwise we simply
    // set editing state to null
    if (steps.find((step) => step.id == editingStep).__unsaved__) {
      setSteps(steps.filter((step) => step.id != editingStep));
      setEditingStep(null);
    } else {
      setEditingStep(null);
    }
  };

  useEffect(() => {
    onEditingStep && onEditingStep(editingStep);
  }, [editingStep]);

  return (
    <>
      <input
        tabIndex={-1}
        name="steps"
        value={steps.length > 0 ? JSON.stringify(steps) : ""}
        required
        onChange={() => {}}
        style={{
          height: "1px",
          width: "100%",
          opacity: 0,
          display: "block",
          pointerEvents: "none",
          border: "none",
          position: "absolute",
        }}
      />
      {steps.map((step, index) => {
        return (
          <StepInput
            key={step.id}
            id={step.id}
            index={index + 1}
            editing={step.id == editingStep}
            chemistries={chemistryRecipes}
            handleCancel={cancelStep}
            handleEdit={editStep}
            handleSave={saveStep}
            defaultValues={{
              chemistry_id: step.chemistry_id,
              chemistry: step._chemistry,
              initialAgitation: step.initialAgitation,
              agitationTime: step.agitationTime,
              agitationIntervals: step.agitationIntervals,
              temp: step.temp,
              duration: step.duration,
            }}
          />
        );
      })}
      <Button type="button" onClick={addStep} disabled={editingStep}>
        Add a step
      </Button>
    </>
  );
}
