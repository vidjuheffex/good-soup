import  { forwardRef } from "react";import "./Input.css";

const Input = forwardRef(({ placeholder, label, type, ...props }, ref) => {
    label = label || "Label";
    let Component = type !== "textarea" ? "input" : "textarea";

    return (
        <label className="Input">
            <div>{label}</div>
            <Component ref={ref} placeholder={placeholder} type={type} {...props} />
        </label>
    );
});

export default Input;