import { useCallback, useRef } from "react";
import Input from "./Input";
import "./StepInput.css";
import { DURATION_INPUT_PATTERN } from "../utils";

export default ({
  chemistries,
  editing,
  handleSave,
  index,
  handleEdit,
  handleCancel,
  disabled,
  id,
  defaultValues = {},
}) => {
  function validateSave(event) {
    let isValid = true; // Assume all inputs are valid initially

    [
      selectChemistryInputRef.current,
      durationInputRef.current,
      initialAgitationInputRef.current,
      agitationTimeInputRef.current,
      agitationIntervalsInputRef.current,
      tempInputRef.current,
    ].forEach((ref) => {
      if (ref && !ref.checkValidity()) {
        isValid = false; // Mark as invalid if any input fails validation
        ref.reportValidity();
      }
    });

    if (isValid) {
      handleSave(event);
    }
  }

  const handleEditClick = useCallback(() => {
    handleEdit(id);
  }, [handleEdit, id]);

  const selectChemistryInputRef = useRef();
  const durationInputRef = useRef();
  const initialAgitationInputRef = useRef();
  const agitationTimeInputRef = useRef();
  const agitationIntervalsInputRef = useRef();
  const tempInputRef = useRef();

  const chemistry = chemistries.find(
    (chem) => chem.id === defaultValues.chemistry_id,
  );

  return (
    <div className={`StepInput ${editing ? "editing" : ""}`}>
      {editing && (
        <>
          <select
            ref={selectChemistryInputRef}
            name="step-chemistry-id"
            defaultValue={defaultValues?.chemistry_id || ""}
            required
          >
            <option value="" hidden disabled>
              Please select a chemistry
            </option>
            {chemistries.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
          <Input
            name="step-temp"
            label="Temperature"
            type="number"
            placeholder="e.g. 68"
            required
            ref={tempInputRef}
            defaultValue={defaultValues?.temp || ""}
          />
          <Input
            type="text"
            name="step-duration"
            label="Duration"
            placeholder="hh:mm:ss"
            pattern={DURATION_INPUT_PATTERN}
            required
            ref={durationInputRef}
            defaultValue={defaultValues?.duration || ""}
          />
          <Input
            name="step-initial-agitation"
            label="Initial Agitation"
            type="text"
            placeholder="hh:mm:ss"
            pattern={DURATION_INPUT_PATTERN}
            ref={initialAgitationInputRef}
            defaultValue={defaultValues?.initialAgitation || ""}
            required
          />
          <Input
            name="step-agitation-time"
            label="Agitation Time"
            type="text"
            pattern={DURATION_INPUT_PATTERN}
            placeholder="hh:mm:ss"
            required
            ref={agitationTimeInputRef}
            defaultValue={defaultValues?.agitationTime || ""}
          />
          <Input
            name="step-agitation-intervals"
            label="Agitation Intervals"
            type="text"
            placeholder="hh:mm:ss"
            pattern={DURATION_INPUT_PATTERN}
            required
            ref={agitationIntervalsInputRef}
            defaultValue={defaultValues?.agitationIntervals || ""}
          />
          <div className="step-controls">
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={validateSave}>
              Save Step
            </button>
          </div>
        </>
      )}
      {!editing && (
        <p>
          {`Step ${index} - ${chemistry?.name}`}
          <button type="button" disabled={disabled} onClick={handleEditClick}>
            edit
          </button>
        </p>
      )}
    </div>
  );
};
