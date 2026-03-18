import React from 'react';
import Toast from './Toast';
import { useToast } from './ToastContext';
import './Toast.css';

export default function ToastContainer() {
    const { toasts, supprimerToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} surFermer={supprimerToast} />
            ))}
        </div>
    );
}
