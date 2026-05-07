"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ToastContainer, ToastItem, Toast } from './toast';

type ToastWithDismiss = Toast & { dismissed?: boolean };

type AddToast = (t: Omit<Toast, 'id'>) => string;

const ToastContext = createContext<{ addToast: AddToast } | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastWithDismiss[]>([]);

  // simple incremental id to avoid uuid dependency
  const idRef = React.useRef(0);

  const addToast = useCallback<AddToast>((t) => {
    const id = `toast_${++idRef.current}`;
  const toast: ToastWithDismiss = { id, ...t };
  setToasts((s) => [toast, ...s]);

    // auto-dismiss (mark dismissed then remove after animation)
    setTimeout(() => {
  setToasts((s) => s.map((x) => (x.id === id ? { ...x, dismissed: true } : x)));
      // remove after animation
      setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 300);
    }, 4000);

    return id;
  }, []);

  const onClose = useCallback((id: string) => {
    // mark dismissed
  setToasts((s) => s.map((x) => (x.id === id ? { ...x, dismissed: true } : x)));
    // remove after animation
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 300);
  }, []);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={onClose} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used inside ToastProvider');
  return ctx;
}
