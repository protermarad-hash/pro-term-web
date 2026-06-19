'use client';

import { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function StockToast() {
  const { lastError, clearError } = useCart();

  useEffect(() => {
    if (!lastError) return;
    const timer = setTimeout(clearError, 4000);
    return () => clearTimeout(timer);
  }, [lastError, clearError]);

  if (!lastError) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 items-center gap-3 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-xl">
      <AlertCircle size={18} className="flex-shrink-0" />
      <span className="flex-1">{lastError}</span>
      <button
        onClick={clearError}
        className="flex-shrink-0 opacity-75 hover:opacity-100 transition-opacity"
        aria-label="Închide"
      >
        <X size={16} />
      </button>
    </div>
  );
}
