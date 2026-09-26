import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { CustomerOrderDetails, OrderItemSummary, createOrderWhatsAppUrl } from '../utils/whatsapp';

interface CheckoutOrderFormProps {
  items: OrderItemSummary[];
  total: number;
  onSuccess?: () => void;
  shippingFee?: number;
  subtotal?: number;
}

export const CheckoutOrderForm: React.FC<CheckoutOrderFormProps> = ({
  items,
  total,
  onSuccess,
  shippingFee,
  subtotal,
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash on Delivery' | 'UPI on Delivery'>('Cash on Delivery');

  // Pincode verification state
  const [isVerifyingPincode, setIsVerifyingPincode] = useState(false);
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [verifiedLocation, setVerifiedLocation] = useState<string | null>(null);

  // Field touch/attempt states for inline validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Indian mobile validation: 10 digits starting with 6, 7, 8, or 9
  const isValidPhone = (val: string) => {
    const clean = val.replace(/\D/g, '');
    return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
  };

  // Field validation checks
  const nameError =
    (submitAttempted || touched.name) && fullName.trim().length < 2
      ? 'Please enter your full name'
      : null;

  const phoneError =
    (submitAttempted || touched.phone) && !isValidPhone(phone)
      ? 'Please enter a valid 10-digit mobile number'
      : null;

  const addressError =
    (submitAttempted || touched.address) && address.trim().length < 5
      ? 'Please enter your complete address (house, street, area)'
      : null;

  const cityError =
    (submitAttempted || touched.city) && city.trim().length < 2
      ? 'Please enter your city'
      : null;

  const stateError =
    (submitAttempted || touched.state) && stateName.trim().length < 2
      ? 'Please enter your state'
      : null;

  const displayPincodeError =
    pincodeError ||
    ((submitAttempted || touched.pincode) && pincode.length !== 6
      ? 'Please enter a valid 6-digit pincode'
      : (submitAttempted || touched.pincode) && !isPincodeVerified && !isVerifyingPincode
      ? 'Please enter a valid pincode'
      : null);

  // Overall validity check
  const isFormValid =
    fullName.trim().length >= 2 &&
    isValidPhone(phone) &&
    address.trim().length >= 5 &&
    pincode.length === 6 &&
    isPincodeVerified &&
    city.trim().length >= 2 &&
    stateName.trim().length >= 2 &&
    !displayPincodeError &&
    !isVerifyingPincode;

  // Pincode lookup via India Post API
  const handlePincodeChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    setPincode(digits);
    setIsPincodeVerified(false);
    setPincodeError(null);
    setVerifiedLocation(null);

    // Cancel any in-flight lookup
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (digits.length === 6) {
      verifyPincode(digits);
    }
  };

  const verifyPincode = async (code: string) => {
    setIsVerifyingPincode(true);
    setPincodeError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('API response was not ok');
      }

      const data = await response.json();

      if (
        Array.isArray(data) &&
        data[0]?.Status === 'Success' &&
        data[0]?.PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        const po = data[0].PostOffice[0];
        const autoCity = po.District || po.Division || po.Block || po.Name || '';
        const autoState = po.State || '';

        // Auto-fill city and state
        setCity(autoCity);
        setStateName(autoState);
        setIsPincodeVerified(true);
        setPincodeError(null);
        setVerifiedLocation(`${autoCity}, ${autoState}`);
      } else {
        setIsPincodeVerified(false);
        setPincodeError('Please enter a valid pincode');
        setVerifiedLocation(null);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setIsPincodeVerified(false);
        setPincodeError('Please enter a valid pincode');
        setVerifiedLocation(null);
      }
    } finally {
      setIsVerifyingPincode(false);
    }
  };

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 10);
    setPhone(clean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid || !isPincodeVerified) {
      return;
    }

    const customerDetails: CustomerOrderDetails = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
      paymentMode,
    };

    const whatsappUrl = createOrderWhatsAppUrl(customerDetails, items, total);
    window.open(whatsappUrl, '_blank');

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-[#1A1A1A]">
      {/* Order Items Preview Pill */}
      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/90 text-xs">
        <div className="flex items-center justify-between font-semibold text-[#1A1A1A] mb-1.5">
          <span>Order Summary ({items.reduce((acc, it) => acc + it.quantity, 0)} items)</span>
          <span className="font-heading font-bold text-sm">₹{total}</span>
        </div>
        <div className="space-y-1 text-neutral-600 max-h-24 overflow-y-auto pr-1">
          {items.map((it, idx) => (
            <div key={idx} className="flex justify-between items-center text-[11px]">
              <span className="truncate max-w-[200px] sm:max-w-[240px] uppercase">
                {it.name.toUpperCase()}
                {it.size && it.size.toLowerCase() !== 'free size' ? ` (Size: ${it.size})` : ''}
                {it.quantity > 1 ? ` x${it.quantity}` : ''}
              </span>
              <span className="font-medium shrink-0">₹{it.price * it.quantity}</span>
            </div>
          ))}
        </div>
        {shippingFee !== undefined && subtotal !== undefined && (
          <div className="mt-2 pt-2 border-t border-neutral-200/60 flex justify-between text-[11px] text-neutral-500 font-mono">
            <span>Delivery (Kota Dispatch):</span>
            <span className={shippingFee === 0 ? 'text-[#4A5D45] font-semibold' : ''}>
              {shippingFee === 0 ? 'FREE (Above ₹999)' : `₹${shippingFee}`}
            </span>
          </div>
        )}
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={() => markTouched('name')}
          placeholder="e.g. Rahul Sharma"
          className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 font-body transition-colors outline-none ${
            nameError
              ? 'border-red-500 bg-red-50/20 focus:border-red-500'
              : 'border-neutral-200 focus:border-[#1A1A1A] focus:bg-white'
          }`}
        />
        {nameError && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{nameError}</span>
          </p>
        )}
      </div>

      {/* Phone Number with +91 indicator */}
      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-xs text-neutral-500 font-mono font-medium pointer-events-none select-none">
            +91
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={() => markTouched('phone')}
            placeholder="10-digit mobile number"
            className={`w-full pl-12 pr-3.5 py-2.5 bg-neutral-50 border rounded-xl text-xs sm:text-sm text-[#1A1A1A] font-mono placeholder-neutral-400 transition-colors outline-none ${
              phoneError
                ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                : 'border-neutral-200 focus:border-[#1A1A1A] focus:bg-white'
            }`}
          />
        </div>
        {phoneError && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{phoneError}</span>
          </p>
        )}
      </div>

      {/* Full Address */}
      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
          Full Address <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onBlur={() => markTouched('address')}
          placeholder="House/Flat No., Building, Street, Locality or Landmark"
          className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 font-body transition-colors outline-none resize-none ${
            addressError
              ? 'border-red-500 bg-red-50/20 focus:border-red-500'
              : 'border-neutral-200 focus:border-[#1A1A1A] focus:bg-white'
          }`}
        />
        {addressError && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{addressError}</span>
          </p>
        )}
      </div>

      {/* Pincode with Auto Verification */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-[#1A1A1A]">
            Pincode <span className="text-red-500">*</span>
          </label>
          {isVerifyingPincode && (
            <span className="text-[11px] text-neutral-500 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin text-[#1A1A1A]" />
              <span>Verifying India Post...</span>
            </span>
          )}
          {isPincodeVerified && (
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified {verifiedLocation ? `(${verifiedLocation})` : ''}</span>
            </span>
          )}
        </div>
        <div className="relative flex items-center">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            onBlur={() => markTouched('pincode')}
            placeholder="6-digit pincode (e.g. 324005)"
            className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-xl text-xs sm:text-sm text-[#1A1A1A] font-mono placeholder-neutral-400 transition-colors outline-none ${
              displayPincodeError
                ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                : isPincodeVerified
                ? 'border-emerald-500 bg-emerald-50/15 focus:border-emerald-600'
                : 'border-neutral-200 focus:border-[#1A1A1A] focus:bg-white'
            }`}
          />
          {isVerifyingPincode && (
            <div className="absolute right-3.5">
              <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
            </div>
          )}
        </div>
        {displayPincodeError && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{displayPincodeError}</span>
          </p>
        )}
      </div>

      {/* City & State (Auto-filled from pincode lookup, but editable) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => markTouched('city')}
            placeholder="City"
            className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 font-body transition-colors outline-none ${
              cityError
                ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                : 'border-neutral-200 focus:border-[#1A1A1A] focus:bg-white'
            }`}
          />
          {cityError && (
            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{cityError}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            onBlur={() => markTouched('state')}
            placeholder="State"
            className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 font-body transition-colors outline-none ${
              stateError
                ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                : 'border-neutral-200 focus:border-[#1A1A1A] focus:bg-white'
            }`}
          />
          {stateError && (
            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{stateError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Payment Mode Selection */}
      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
          Payment Mode
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setPaymentMode('Cash on Delivery')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              paymentMode === 'Cash on Delivery'
                ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-xs'
                : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-heading font-semibold text-xs">Cash on Delivery</span>
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMode === 'Cash on Delivery'
                    ? 'border-white bg-white'
                    : 'border-neutral-300'
                }`}
              >
                {paymentMode === 'Cash on Delivery' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                )}
              </span>
            </div>
            <span
              className={`text-[10px] ${
                paymentMode === 'Cash on Delivery' ? 'text-neutral-300' : 'text-neutral-500'
              }`}
            >
              Pay cash at delivery
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('UPI on Delivery')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              paymentMode === 'UPI on Delivery'
                ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-xs'
                : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-heading font-semibold text-xs">UPI on Delivery</span>
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMode === 'UPI on Delivery'
                    ? 'border-white bg-white'
                    : 'border-neutral-300'
                }`}
              >
                {paymentMode === 'UPI on Delivery' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                )}
              </span>
            </div>
            <span
              className={`text-[10px] ${
                paymentMode === 'UPI on Delivery' ? 'text-neutral-300' : 'text-neutral-500'
              }`}
            >
              Scan QR code upon arrival
            </span>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!isFormValid || !isPincodeVerified || isVerifyingPincode}
          className={`w-full py-3.5 px-4 rounded-xl font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            isFormValid && isPincodeVerified && !isVerifyingPincode
              ? 'bg-[#1A1A1A] hover:bg-[#4A5D45] text-white shadow-sm cursor-pointer active:scale-98'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>Place Order on WhatsApp</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 mt-2 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4A5D45] shrink-0" />
          <span>Direct dispatch from Kota Hub • 7-day easy size exchange</span>
        </div>
      </div>
    </form>
  );
};
