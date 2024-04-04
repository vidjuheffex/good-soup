import "./Content.css";

export default ({ children, className }) => {
  return (
    <div className={`Content ${className ? className : ""}`}>{children}</div>
  );
};
