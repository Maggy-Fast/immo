import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const notifier = useCallback((message, type = 'success', duree = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duree }]);

        if (duree !== Infinity) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duree);
        }
    }, []);

    const supprimerToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const valeur = useMemo(() => ({ notifier, toasts, supprimerToast }), [notifier, toasts, supprimerToast]);

    return (
        <ToastContext.Provider value={valeur}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast doit être utilisé à l\'intérieur de ToastProvider');
    }
    return context;
}
