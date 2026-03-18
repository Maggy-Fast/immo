import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.css';

const ICONES = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
};

export default function Toast({ toast, surFermer }) {
    const { message, type = 'success' } = toast;

    return (
        <div className={`toast toast--${type}`} role="alert">
            <div className="toast__icone">
                {ICONES[type] || ICONES.info}
            </div>
            <div className="toast__message">
                {message}
            </div>
            <button className="toast__fermer" onClick={() => surFermer(toast.id)}>
                <X size={16} />
            </button>
        </div>
    );
}
