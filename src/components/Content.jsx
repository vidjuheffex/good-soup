import "./Content.css";

export default function Content({ children, className }) {
  return (
    <div className={`Content ${className ? className : ""}`}>{children}</div>
  );
}
