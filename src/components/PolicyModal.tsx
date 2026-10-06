import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, Ruler, FileText, AlertTriangle } from 'lucide-react';

export type PolicyType = 'shipping' | 'returns' | 'cod' | 'terms' | 'sizing' | null;

interface PolicyModalProps {
  type: PolicyType;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xl overflow-y-auto max-h-[85vh] text-[#1A1A1A]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {type === 'shipping' && (
          <div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#1A1A1A] mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#1A1A1A] mb-1">
              Shipping & Delivery Policy
            </h3>
            <p className="text-xs text-[#EA580C] font-semibold mb-4">
              Fast express dispatch nationwide
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed font-body">
              <p>
                • <strong>Free Shipping:</strong> On all orders of ₹999 or more. For orders below ₹999, a delivery fee of ₹150 applies nationwide.
              </p>
              <p>
                • <strong>Delivery Timelines:</strong> Major metro cities take 2 to 3 business days. Rest of India takes 3 to 5 business days.
              </p>
              <p>
                • <strong>Tracking:</strong> Real-time WhatsApp tracking updates and courier tracking URLs are dispatched within 24 hours of placing your order.
              </p>
              <p>
                • <strong>Tamper-Proof Packaging:</strong> Every piece is packed in sealed polybags and cushioned bubble boxes.
              </p>
            </div>
          </div>
        )}

        {type === 'returns' && (
          <div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#1A1A1A] mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#1A1A1A] mb-1">
              Exchange & No Refunds Policy
            </h3>
            <p className="text-xs text-[#EA580C] font-semibold mb-4">
              Strict Quality Verification & Exchange Terms
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed font-body">
              <p>
                • <strong>No Refunds Policy:</strong> All sales are final. We do not provide cash or monetary refunds.
              </p>
              <p>
                • <strong>Exchanges:</strong> Only exchanges are permitted, strictly if transit defect/damage or wrong item is proven via an uncut 360-degree unboxing video submitted within 48 hours of delivery.
              </p>
              <p>
                • <strong>Unboxing Video Requirement:</strong> To be eligible for an exchange, the continuous 360-degree video must clearly display the parcel label, seal, and opening process without cuts or edits.
              </p>
            </div>
          </div>
        )}

        {(type === 'terms' || type === 'cod') && (
          <div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#1A1A1A] mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#1A1A1A] mb-1">
              Terms & Conditions
            </h3>
            <p className="text-xs text-[#EA580C] font-semibold mb-4">
              Platform Disclaimers & Marketplace Guidelines
            </p>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-body">
              {/* About ZYLE */}
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-1">
                  About ZYLE
                </h4>
                <p className="text-neutral-600 leading-relaxed">
                  A discovery marketplace connecting buyers directly to independent makers and suppliers.
                </p>
              </div>

              {/* Strict Disclaimers */}
              <div className="space-y-2.5">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#DC2626] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Strict Disclaimers</span>
                </h4>
                <ol className="space-y-3 list-decimal list-inside text-neutral-600">
                  <li className="pl-1 leading-relaxed">
                    <strong className="text-[#1A1A1A]">Marketplace Model:</strong> We are a marketplace platform; we do not own or manufacture inventory. Products are fulfilled and dispatched directly by independent third-party vendors.
                  </li>
                  <li className="pl-1 leading-relaxed">
                    <strong className="text-[#1A1A1A]">Transit Liability:</strong> ZYLE is not liable for carrier or vendor transit delays.
                  </li>
                  <li className="pl-1 leading-relaxed">
                    <strong className="text-[#1A1A1A]">No Refunds Policy:</strong> All sales are final. Only exchanges are permitted, strictly if transit defect/damage or wrong item is proven via an uncut 360-degree unboxing video submitted within 48 hours of delivery.
                  </li>
                  <li className="pl-1 leading-relaxed">
                    <strong className="text-[#1A1A1A]">COD Convenience Fee:</strong> Flat ₹149 COD Convenience Fee applies to all orders to cover verified logistics and courier handling.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {type === 'sizing' && (
          <div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#1A1A1A] mb-4">
              <Ruler className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#1A1A1A] mb-1">
              Size & Fit Guide
            </h3>
            <p className="text-xs text-[#EA580C] font-semibold mb-4">
              Oversized Drops & Universal Watch Straps
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed font-body">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-700">
                      <th className="py-2">Size</th>
                      <th className="py-2">Chest (Inches)</th>
                      <th className="py-2">Height Suitability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr>
                      <td className="py-2 font-semibold text-[#1A1A1A]">S</td>
                      <td className="py-2">40" (Oversized)</td>
                      <td className="py-2">5'4" – 5'7"</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold text-[#1A1A1A]">M</td>
                      <td className="py-2">42" (Oversized)</td>
                      <td className="py-2">5'7" – 5'10"</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold text-[#1A1A1A]">L</td>
                      <td className="py-2">44" (Oversized)</td>
                      <td className="py-2">5'10" – 6'1"</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold text-[#1A1A1A]">XL</td>
                      <td className="py-2">46" (Oversized)</td>
                      <td className="py-2">6'1" +</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="pt-2 text-neutral-500">
                • <strong>Watches:</strong> All Zyle watches feature adjustable Milanese magnetic straps, multi-hole silicone bands, or link bracelets that fit wrist sizes from 6.0" to 8.5".
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#EA580C] text-white font-heading font-semibold text-xs transition cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
