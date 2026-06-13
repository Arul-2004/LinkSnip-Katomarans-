import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-width: 440px;',
    md: 'max-width: 640px;',
    lg: 'max-width: 800px;',
  };

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(11, 23, 54, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-4)',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div 
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="modal-container"
      >
        {/* Style tag just to set custom max-width easily dynamically without classes */}
        <style>{`
          .modal-container {
            ${sizeClasses[size] || sizeClasses.md}
          }
        `}</style>

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-5) var(--space-6)',
          borderBottom: '1px solid var(--color-border-light)',
        }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{title}</h3>
          <button 
            onClick={onClose} 
            className="btn btn-icon btn-ghost" 
            style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FiX style={{ fontSize: '1.25rem' }} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: 'var(--space-6)',
          overflowY: 'auto',
          flex: 1,
        }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
