import { forwardRef, useState } from "react";
import "./Input.css";
import DurationInput from "./DurationInput";

/**
 * Input component
 *
 * This component is a wrapper around the native input element. It provides a consistent
 * look and feel for input elements. It also provides a way to handle different input types
 * beyong the native input types.
 *
 * type - temperature - This will render a number input with a temperature unit next to it.
 *                      it also accepts a maxLength prop to limit the number of characters.
 * type - duration - This will render a Duration component that accepts a duration in days,
 *                   weeks and months.
 * type - textarea - This will render a textarea element.
 *
 * @component
 * @param {string} placeholder - Placeholder text
 * @param {string} label - Label text
 * @param {string} type - Input type
 * @param {string} autoComplete - Autocomplete attribute
 * @param {function} onChange - On change event handler
 * @param {string} value - Input value
 * @param {string} defaultValue - Default input value
 * @param {boolean} defaultChecked - Default checked state
 * @param {object} props - Additional props
 * @param {object} ref - Ref
 * @returns {JSX.Element}
 */

const Input = forwardRef(
  (
    {
      placeholder,
      label,
      type,
      autoComplete,
      onChange,
      value,
      defaultValue,
      defaultChecked,
      maxLength,
      ...props
    },
    ref,
  ) => {
    let Component =
      type === "textarea"
        ? "textarea"
        : type === "duration"
          ? DurationInput
          : "input";

    let calculatedType = type;

    if (type === "temperature" || type === "milliliters") {
      calculatedType = "number";
    } else if (type === "textarea") {
      calculatedType = undefined;
    }

    const [inputState, setInputState] = useState(
      type === "checkbox" ? defaultChecked : defaultValue || "",
    );

    const handleInputChange = (ev) => {
      let newState;

      switch (calculatedType) {
        case "checkbox":
          newState = ev.target.checked;
          break;
        case "number":
          if (maxLength && ev.target.value.length > maxLength) {
            newState = ev.target.value.slice(0, maxLength);
            break;
          } // else fall through
        default:
          newState = ev.target.value;
      }
      setInputState(newState);
      if (onChange) {
        onChange(ev);
      }
    };

    const inputProps = {
      autoComplete: autoComplete || "off",
      ref,
      placeholder,
      maxLength,
      type: calculatedType,
      onChange: handleInputChange,
      ...(type === "duration" && { defaultValue: inputState }),
      ...(type === "checkbox"
        ? { checked: inputState }
        : { value: inputState }),
      ...props,
    };

    let suffix =
      type === "temperature" ? "°F" : type === "milliliters" ? "ml" : "";

    return (
      <label className={`Input ${type === "checkbox" ? "checkbox" : ""}`}>
        {label && <div className="label">{label}</div>}
        <div className="input-wrapper">
          {(type === "temperature" || type === "milliliters") && inputState && (
            <div className="suffix">
              <span className="see-through">{inputState}</span>{" "}
              <span>{suffix}</span>
            </div>
          )}
          <Component {...inputProps} />
        </div>
      </label>
    );
  },
);

export default Input;
