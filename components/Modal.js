// components/Modal.js

import React from 'react';
import styles from '../styles/modal.module.css';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, hideConfirmButton, hideCancelButton, children, isQrScanner }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={isQrScanner ? styles.qrScannerModalContent : styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>{title}</h3>
                </div>
                <div className={styles.modalBody}>
                    {message && <p className={styles.modalMessage}>{message}</p>}
                    {children}
                </div>
                <div className={styles.modalFooter}>
                    {!hideCancelButton && (
                        <button onClick={onCancel} className={styles.cancelButton}>
                            {cancelText || 'Cancel'}
                        </button>
                    )}
                    {!hideConfirmButton && (
                        <button onClick={onConfirm} className={styles.confirmButton}>
                            {confirmText || 'OK'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;