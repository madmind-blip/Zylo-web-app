import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, Ruler, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../data/content';

export type PolicyType = 'shipping' | 'returns' | 'cod' | 'sizing' | null;

interface PolicyModalProps {
  type: PolicyType;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-[#141414] border border-[#242424] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-[#242424] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {type === 'shipping' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-white mb-2">
              Shipping & Delivery Policy
            </h3>
            <p className="text-xs text-[#D4AF37] font-semibold mb-4">
              Direct dispatch from Kota, Rajasthan
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-body">
              <p>
                • <strong>Free Shipping:</strong> On all orders of ₹999 or more. For orders below ₹999, a flat delivery fee of ₹69 applies nationwide.
              </p>
              <p>
                • <strong>Delivery Timelines:</strong> Kota & Rajasthan deliveries take 24 to 48 hours. Metro cities & rest of India take 3 to 5 business days.
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
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-white mb-2">
              7-Day Return & Exchange Policy
            </h3>
            <p className="text-xs text-[#D4AF37] font-semibold mb-4">
              Hassle-Free Size Swaps & Quality Guarantee
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-body">
              <p>
                • <strong>Size Exchanges:</strong> If your tee or cargo is not the right fit, we arrange a quick size replacement within 7 days of delivery.
              </p>
              <p>
                • <strong>Defect Replacement:</strong> In the rare event an item arrives defective or damaged in transit, ping us on WhatsApp with an unboxing video or photo, and we will dispatch a brand-new piece immediately with no reverse shipping charges.
              </p>
              <p>
                • <strong>Conditions:</strong> Garments must be unwashed, unworn, with original tags intact.
              </p>
            </div>
          </div>
        )}

        {type === 'cod' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-white mb-2">
              Cash on Delivery (COD) Terms
            </h3>
            <p className="text-xs text-[#D4AF37] font-semibold mb-4">
              Zero Prepaid Risk for Indian Shoppers
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-body">
              <p>
                • <strong>Available Nationwide:</strong> COD is valid across 19,000+ PIN codes in India through our courier partners (Bluedart, Delhivery, Xpressbees).
              </p>
              <p>
                • <strong>Order Verification:</strong> To prevent duplicate and prank bookings, our Kota team may send a 1-click confirmation prompt on WhatsApp before parcel handover to the courier.
              </p>
              <p>
                • <strong>Payment Mode at Doorstep:</strong> You can pay the delivery executive in cash or scan their UPI QR code on arrival.
              </p>
            </div>
          </div>
        )}

        {type === 'sizing' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-white mb-2">
              Size & Fit Guide
            </h3>
            <p className="text-xs text-[#D4AF37] font-semibold mb-4">
              Oversized Drops & Universal Watch Straps
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-body">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#242424] text-[#D4AF37]">
                      <th className="py-2">Size</th>
                      <th className="py-2">Chest (Inches)</th>
                      <th className="py-2">Height Suitability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242424]">
                    <tr>
                      <td className="py-2 font-bold text-white">S</td>
                      <td className="py-2">40" (Oversized)</td>
                      <td className="py-2">5'4" – 5'7"</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-white">M</td>
                      <td className="py-2">42" (Oversized)</td>
                      <td className="py-2">5'7" – 5'10"</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-white">L</td>
                      <td className="py-2">44" (Oversized)</td>
                      <td className="py-2">5'10" – 6'1"</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-white">XL</td>
                      <td className="py-2">46" (Oversized)</td>
                      <td className="py-2">6'1" +</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="pt-2 text-zinc-400">
                • <strong>Watches:</strong> All Zyle watches feature adjustable Milanese magnetic straps, multi-hole silicone bands, or link bracelets that fit wrist sizes from 6.0" to 8.5".
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#242424] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-heading font-bold text-xs hover:bg-[#E5C158] transition cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
