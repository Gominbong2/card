import React, { useEffect } from "react";
import ReactDOM from "react-dom";
// 이 부분을 변경합니다: .css 대신 .scss 확장자로 변경
import "./modal.scss"; // <--- 여기가 변경됩니다.

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscapeKey);

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.error(
      "Error: 'modal-root' element not found in index.html. Please ensure <div id='modal-root'></div> is in your public/index.html file."
    );
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
