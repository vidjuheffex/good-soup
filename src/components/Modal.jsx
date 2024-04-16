import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

// Enhanced Modal component with Escape key handling and accessibility considerations
export default function Modal({ children, title, handleClose }) {
  // Effect for handling Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Close modal when Escape key is pressed
      if (event.key === "Escape") {
        handleClose();
      }
    };

    // Add keydown event listener to document
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup by removing event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]); // Depend on handleClose to recreate effect if it changes

  return createPortal(
    <div
      className="Modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
    >
      <div className="ModalWindow">
        <div className="modalHeading">
          <h1 id="modalTitle">{title}</h1>
          <button
            className="ModalX"
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
          >
          <span>  {'\u00D7'}</span>
          </button>
        </div>

        <div id="modalDescription" className="ModalContent">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
