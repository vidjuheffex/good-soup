import { createPortal } from "react-dom";
import "./Modal.css";

export default function Modal({ children, handleClose }) {
  return createPortal(
    <div className="Modal">
      <div className="ModalWindow">
        <button className="ModalX" type="button" onClick={handleClose}>
          X
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
