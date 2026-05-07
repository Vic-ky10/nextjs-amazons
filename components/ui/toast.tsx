"use client";
import React from 'react';
import { X as LucideX } from 'lucide-react';

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  type?: 'info' | 'success' | 'error' | 'warning';
};

export function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast & { dismissed?: boolean };
  onClose: (id: string) => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-white dark:bg-gray-800 border rounded-md shadow-md p-3 mb-2 flex items-start gap-3 max-w-sm transform transition-all duration-300 ease-in-out ${
        toast.dismissed ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      <div className="flex-1">
        {toast.title && <div className="font-semibold">{toast.title}</div>}
        {toast.description && (
          <div className="text-sm text-gray-600 dark:text-gray-300">{toast.description}</div>
        )}
      </div>
      <button aria-label="Close" onClick={() => onClose(toast.id)} className="text-gray-500 hover:text-gray-700">
        <LucideX size={16} />
      </button>
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end">{children}</div>
  );
}
