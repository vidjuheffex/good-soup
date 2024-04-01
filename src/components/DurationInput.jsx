import { forwardRef, useState } from "react";
import "./DurationInput.css";

const createCompoundValue = (numeric, unit) => {
  if (!(numeric && unit)) return undefined;
  return `${numeric}${unit}`;
};

const DurationInput = ({ disabled, name, required, ...props }, ref) => {
  const [numericValue, setNumericValue] = useState(undefined);
  const [unitValue, setUnitValue] = useState("d");
  const [value, setValue] = useState(null);

  const handleNumericChange = (e) => {
    let val = e.target.value;
    setNumericValue(val);
    setValue(createCompoundValue(val, unitValue));
  };

  const handleUnitChange = (e) => {
    let val = e.target.value;
    setUnitValue(val);
    setValue(createCompoundValue(numericValue, val));
  };

  return (
    <div className="DurationInput">
      <input
        name={name}
        value={value}
        ref={ref}
        required={required}
        style={{
          height: "100%",
          width: "100%",
          opacity: 0,
          display: "block",
          pointerEvents: "none",
          border: "none",
          position: "absolute",
        }}
      />
      <input
        type="number"
        min={0}
        disabled={disabled}
        onChange={handleNumericChange}
      />
      <select value={unitValue} disabled={disabled} onChange={handleUnitChange}>
        <option value="d">{`Day${numericValue == 1 ? "" : "s"}`}</option>
        <option value="w">{`Week${numericValue == 1 ? "" : "s"}`}</option>
        <option value="m">{`Month${numericValue == 1 ? "" : "s"}`}</option>
      </select>
    </div>
  );
};

export default forwardRef(DurationInput);
