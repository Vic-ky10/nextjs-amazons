"use client";
import { useCallback } from 'react';
import { useToastContext } from './toast-provider';

export function useToast() {
  const { addToast } = useToastContext();

  const toast = useCallback(
    (title: string, description?: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
      return addToast({ title, description, type });
    },
    [addToast]
  );

  return { toast };
}
