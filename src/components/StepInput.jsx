import { useCallback, useRef } from "react";
import Input from "./Input";
import './StepInput.css';

export default ({
  chemistries,
  editing,
  handleSave,
  index,
  handleEdit,
  disabled,
  id,
  defaultValues={}
}) => {
  console.log(defaultValues)
  function validateSave(event) {
    const isValid = [
      selectChemistryInputRef.current,
      durationInputRef.current,
      initialAgitationInputRef.current,
      agitationInversionsInputRef.current,
      agitationIntervalsInputRef.current,
      tempInputRef.current,
    ].every((ref) => ref && ref.checkValidity());

    if (isValid) {
      handleSave(event);
    }
  }

  const handleEditClick = useCallback(() => {
    handleEdit(id);
  },[handleEdit, id])

  const selectChemistryInputRef = useRef();
  const durationInputRef = useRef();
  const initialAgitationInputRef = useRef();
  const agitationInversionsInputRef = useRef();
  const agitationIntervalsInputRef = useRef();
  const tempInputRef = useRef();

  return (
    <div className={`StepInput ${editing ? 'editing' : ''}`}>
      {editing && (
        <>
          <select
            ref={selectChemistryInputRef}
            name="step-chemistry"
            defaultValue={defaultValues?.chemistry || ""}
            required
          >
            <option value="" hidden disabled>
              Please select a chemistry
            </option>
            {chemistries.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
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
            pattern="^((\d+:)?\d+:)?\d*$" 
            required
            ref={durationInputRef}
            defaultValue={defaultValues?.duration || ""}
          />
          <Input
            name="step-initial-agitation"
            label="Initial Agitation"
            type="text"
            placeholder="hh:mm:ss"
            pattern="^((\d+:)?\d+:)?\d*$" 
            ref={initialAgitationInputRef}
            defaultValue={defaultValues?.initialAgitation || ""}
          />
          <Input
            name="step-agitation-inversions"
            label="Agitation Inversions"
            type="number"
            placeholder="e.g. 4"
            required
            ref={agitationInversionsInputRef}
            defaultValue={defaultValues?.agitationInversions || ""}
          />
          <Input
            name="step-agitation-intervals"
            label="Agitation Intervals"
            type="text"
            placeholder="hh:mm:ss"
            pattern="^((\d+:)?\d+:)?\d*$"
            required
            ref={agitationIntervalsInputRef}
            defaultValue={defaultValues?.agitationIntervals || ""}
          />
          <button type="button" onClick={validateSave}>
            Save Step
          </button>
        </>
      )}
      {!editing && (
        <p>
          {`Step ${index}`}
          <button type="button" disabled={disabled} onClick={handleEditClick}>
            edit
          </button>
        </p>
      )}
    </div>
  );
};
