'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-green-600 border-green-700',
    error: 'bg-red-600 border-red-700',
    info: 'bg-blue-600 border-blue-700',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
      <div className={`${styles[type]} text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-2xl border-l-4 flex items-center gap-2 sm:gap-3 min-w-[280px] sm:min-w-[320px] max-w-[90vw] sm:max-w-md`}>
        <div className="text-xl sm:text-2xl font-bold">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base break-words">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold text-xl flex-shrink-0"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
