"use client";

import {
  type ReactNode,
  type MouseEvent,
  type CSSProperties,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Modal content width, default 388px */
  width?: number | string;
}

export function Modal({
  isOpen,
  title,
  onClose,
  children,
  width = 388,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const style: CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
  };

  const modalNode = (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal"
        style={style}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal__header">
          <h4 className="modal__title">{title}</h4>
          <button
            type="button"
            className="modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}

