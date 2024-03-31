import "./Input.css"

export default ({placeholder, label, type, ...props}) => {
    placeholder = placeholder || "Placeholder text"
    label = label || "Label"
    let Component = type != "textarea" ? "input": "textarea"

    return <label className="Input">
       <div>{label}</div>
       <Component placeholder={placeholder} type={type} {...props} />
       </label>
}