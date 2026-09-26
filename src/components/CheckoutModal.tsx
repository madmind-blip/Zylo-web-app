import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { OrderItemSummary } from '../utils/whatsapp';
import { CheckoutOrderForm } from './CheckoutOrderForm';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItemSummary[];
  total: number;
  title?: string;
  shippingFee?: number;
  subtotal?: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  total,
  title = 'Complete Your Order',
  shippingFee,
  subtotal,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 text-[#1A1A1A] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[#1A1A1A]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#1A1A1A]">
                {title}
              </h3>
              <p className="text-[11px] text-neutral-500 font-body">
                Dispatched directly from Kota, Rajasthan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Checkout Form */}
        <CheckoutOrderForm
          items={items}
          total={total}
          shippingFee={shippingFee}
          subtotal={subtotal}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
};
