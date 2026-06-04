import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/common.css';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  primaryLabel = 'Confirm',
  secondaryLabel = 'Cancel',
  primaryVariant = 'primary',
  onPrimaryClick,
  onSecondaryClick,
  showFooter = true,
  closeOnBackdrop = true,
}) {
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onClose?.();
    }, 200);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !exiting) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`modal-backdrop ${exiting ? 'modal-backdrop--exiting' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        {/* Header */}
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">
            {title}
          </h2>
          <button
            className="modal__close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">{children}</div>

        {/* Footer */}
        {showFooter && (
          <div className="modal__footer">
            {footer || (
              <>
                <button
                  className="modal__btn modal__btn--secondary"
                  onClick={() => {
                    onSecondaryClick?.();
                    handleClose();
                  }}
                >
                  {secondaryLabel}
                </button>
                <button
                  className={`modal__btn modal__btn--${primaryVariant}`}
                  onClick={onPrimaryClick}
                >
                  {primaryLabel}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
