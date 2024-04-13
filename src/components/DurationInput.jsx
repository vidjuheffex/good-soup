import { forwardRef, useState, useEffect } from "react";
import "./DurationInput.css";

const parseDefaultValue = (defaultValue) => {
  if (!defaultValue) return { numeric: undefined, unit: "d" }; // Default unit is "d" (days)
  const numeric = defaultValue.replace(/\D/g, '');
  const unit = defaultValue.replace(/\d/g, '');
  return { numeric, unit };
};

const createCompoundValue = (numeric, unit) => {
  if (!(numeric && unit)) return undefined;
  return `${numeric}${unit}`;
};

const DurationInput = forwardRef(
  ({ disabled, name, required, defaultValue, ...props }, ref) => {
    const parsedDefault = parseDefaultValue(defaultValue);
    const [numericValue, setNumericValue] = useState(parsedDefault.numeric);
    const [unitValue, setUnitValue] = useState(parsedDefault.unit);
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      setValue(createCompoundValue(numericValue, unitValue));
    }, [numericValue, unitValue]);

    const handleNumericChange = (e) => {
      const val = e.target.value;
      setNumericValue(val);
    };

    const handleUnitChange = (e) => {
      const val = e.target.value;
      setUnitValue(val);
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
          readOnly
        />
        <input
          type="number"
          min={0}
          disabled={disabled}
          value={numericValue || ""}
          onChange={handleNumericChange}
        />
        <select
          value={unitValue}
          disabled={disabled}
          onChange={handleUnitChange}
        >
          <option value="d">{`Day${numericValue == 1 ? "" : "s"}`}</option>
          <option value="w">{`Week${numericValue == 1 ? "" : "s"}`}</option>
          <option value="m">{`Month${numericValue == 1 ? "" : "s"}`}</option>
        </select>
      </div>
    );
  }
);

export default DurationInput;
