import { forwardRef } from "react";
import "./Input.css";
import DurationInput from "./DurationInput";

const Input = forwardRef(
  ({ placeholder, label, type, autoComplete, ...props }, ref) => {
    label = label || "Label";
    let Component =
      type == "textarea"
        ? "textarea"
        : type == "duration"
        ? DurationInput
          : "input";

    let calculatedType=type;
    
    if (type=="temperature") {
      calculatedType = "number"
    } else if (type=="textarea") {
      calculatedType=undefined
    }

    

    const isCheckbox = type=="checkbox"

    return (
      <label className={`Input ${isCheckbox ? "checkbox" : ""}`}>
        <div>{label}</div>
        <Component
          className={type == "temperature" ? "temperature" : "input"}
          autoComplete={autoComplete || "off"}
          ref={ref}
          placeholder={placeholder}
          type={calculatedType}fire
          {...props}
        />
      </label>
    );
  }
);

export default Input;
