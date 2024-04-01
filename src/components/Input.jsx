import { forwardRef } from "react"; import "./Input.css";
import DurationInput from "./DurationInput";

const Input = forwardRef(({ placeholder, label, type, ...props }, ref) => {
    label = label || "Label";
    let Component = type == "textarea" ? "textarea" : type == "duration" ? DurationInput : "input";

    return (
        <label className="Input">
            <div>{label}</div>
            <Component ref={ref} placeholder={placeholder} type={type} {...props} />
        </label>
    );
});

export default Input;