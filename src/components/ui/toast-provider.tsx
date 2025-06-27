import React, { createContext, useState, useCallback, ReactNode } from 'react';

type ToastType = {
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextType = {
  showToast: (toast: ToastType) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = useCallback((toast: ToastType) => {
    setToasts((prev) => [...prev, toast]);
    // Optionally implement auto-dismiss logic
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Your custom Toast rendering component here */}
    </ToastContext.Provider>
  );
};
