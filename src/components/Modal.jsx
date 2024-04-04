import { createPortal } from "react-dom";
import "./Modal.css";

export default ({ children, handleClose }) =>
  createPortal(
    <div className="Modal" onClick={handleClose}>
      <div
        className="ModalWindow"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button className="ModalX" type="button" onClick={handleClose}>
          X
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
