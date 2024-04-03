import { createPortal } from "react-dom";
import "./Modal.css";

export default ({ children, handleClose }) =>
  createPortal(
    <div className="Modal" onClick={handleClose}>
      <div
        className="ModalWindow"
        onClick={(e) => {
          e.stopPropagation();
          e.PreventDefault();
        }}
      >
        <button className="ModalX" onClick={handleClose}>
          X
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
