"use client";
import React from 'react';
import { useToast } from './use-toast';

export default function ToastDemo() {
  const { toast } = useToast();

  return (
    <div>
      <button
        onClick={() => toast('Hello', 'This is a demo toast', 'success')}
        className="px-3 py-2 bg-blue-600 text-white rounded"
      >
        Show toast
      </button>
    </div>
  );
}
