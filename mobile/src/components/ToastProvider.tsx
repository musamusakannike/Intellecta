import React, { useState, useEffect } from 'react';
import { Toast, ToastProps, toast as toastManager } from './Toast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastProps | null>(null);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((newToast) => {
      setToast(newToast);
    });

    return unsubscribe;
  }, []);

  const handleDismiss = () => {
    setToast(null);
  };

  return (
    <>
      {children}
      {toast && (
        <Toast
          {...toast}
          onDismiss={handleDismiss}
        />
      )}
    </>
  );
};
