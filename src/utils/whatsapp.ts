import { CartItem, Product } from '../types';
import { BRAND } from '../data/content';

/**
 * Creates a clean WhatsApp direct link
 */
export function getWhatsAppNumberClean(): string {
  return BRAND.whatsappNumber.replace(/[^0-9]/g, '');
}

export function createProductWhatsAppUrl(
  product: Product,
  selectedSize: string,
  quantity: number = 1
): string {
  const phone = getWhatsAppNumberClean();
  const totalPrice = product.price * quantity;
  const isFreeDelivery = totalPrice >= BRAND.deliveryThreshold;

  const lines = [
    `👋 *Hello Zyle! I want to order this item:*`,
    ``,
    `🏷️ *Product:* ${product.name}`,
    `📏 *Selected Size:* ${selectedSize}`,
    `🔢 *Quantity:* ${quantity}`,
    `💰 *Price:* ₹${totalPrice} (Orig: ~₹${product.originalPrice * quantity}~)`,
    `🚚 *Delivery:* ${isFreeDelivery ? 'FREE (Above ₹999)' : 'Standard Delivery'}`,
    `📦 *Payment:* Cash on Delivery (COD) / UPI`,
    ``,
    `📍 *My Delivery Details:*`,
    `Name: `,
    `Complete Address & Pincode: `,
    `City: `,
    ``,
    `_Sent from Zyle Online Store (Kota, Rajasthan)_`
  ];

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${text}`;
}

export function createCustomComboWhatsAppUrl(
  top: { product: Product; size: string },
  bottom: { product: Product; size: string },
  watch: { product: Product },
  originalPrice: number,
  discountAmount: number,
  finalPrice: number
): string {
  const phone = getWhatsAppNumberClean();
  const isFreeDelivery = finalPrice >= BRAND.deliveryThreshold;

  const lines = [
    `🔥 *Hello Zyle! I created a Custom 3-Piece Combo on your website:*`,
    ``,
    `👕 *1. Top:* ${top.product.name} (Size: ${top.size}) - ₹${top.product.price}`,
    `👖 *2. Bottom:* ${bottom.product.name} (Size: ${bottom.size}) - ₹${bottom.product.price}`,
    `⌚ *3. Watch:* ${watch.product.name} - ₹${watch.product.price}`,
    ``,
    `--------------------------`,
    `Subtotal: ₹${originalPrice}`,
    `🎉 *Combo Saver Discount (10% OFF): -₹${discountAmount}*`,
    `✨ *Final Combo Price: ₹${finalPrice}*`,
    `🚚 *Delivery:* ${isFreeDelivery ? 'FREE Delivery (Above ₹999)' : '₹69 Standard Delivery'}`,
    `💳 *Payment Mode:* Cash on Delivery (COD)`,
    `--------------------------`,
    ``,
    `📍 *My Shipping Details:*`,
    `Name: `,
    `Full Street Address & Landmark: `,
    `City & Pincode: `,
    `Mobile Number: `,
    ``,
    `Please confirm dispatch from Kota! Thank you! 🙌`
  ];

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${text}`;
}

export function createFlexibleBundleWhatsAppUrl(
  items: Array<{ product: Product; size: string }>,
  originalPrice: number,
  discountPercent: number,
  discountAmount: number,
  finalPrice: number
): string {
  const phone = getWhatsAppNumberClean();
  const isFreeDelivery = finalPrice >= BRAND.deliveryThreshold;

  const itemLines = items.map((it, idx) => {
    const sizePart = it.size && it.size !== 'Free Size' ? ` [Size: ${it.size}]` : '';
    return `📦 *${idx + 1}.* ${it.product.name}${sizePart} - ₹${it.product.price}`;
  });

  const lines = [
    `🔥 *Hello Zyle! I created a Custom ${items.length}-Item Bundle on your website:*`,
    ``,
    ...itemLines,
    ``,
    `--------------------------`,
    `Subtotal: ₹${originalPrice}`,
    discountAmount > 0
      ? `🎉 *Bundle Saver Discount (${discountPercent}% OFF): -₹${discountAmount}*`
      : `_Add 3 items to unlock 10% OFF discount_`,
    `✨ *Final Bundle Price: ₹${finalPrice}*`,
    `🚚 *Delivery:* ${isFreeDelivery ? 'FREE Delivery (Above ₹999)' : '₹69 Standard Delivery'}`,
    `💳 *Payment Mode:* Cash on Delivery (COD)`,
    `--------------------------`,
    ``,
    `📍 *My Shipping Details:*`,
    `Name: `,
    `Full Street Address & Landmark: `,
    `City & Pincode: `,
    `Mobile Number: `,
    ``,
    `Please confirm dispatch from Kota! Thank you! 🙌`
  ];

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${text}`;
}

export function createCartWhatsAppUrl(
  cartItems: CartItem[],
  subtotal: number,
  shippingFee: number,
  grandTotal: number
): string {
  const phone = getWhatsAppNumberClean();
  
  const itemLines = cartItems.map((item, idx) => {
    if (item.isCustomCombo && item.comboItems) {
      return `${idx + 1}. 💎 *Custom 3-Piece Combo* (x${item.quantity})
   • Top: ${item.comboItems.top.name} [Size: ${item.comboItems.top.size}]
   • Bottom: ${item.comboItems.bottom.name} [Size: ${item.comboItems.bottom.size}]
   • Watch: ${item.comboItems.watch.name}
   = ₹${item.product.price * item.quantity}`;
    }
    return `${idx + 1}. 🛍️ *${item.product.name}*
   • Size: ${item.selectedSize} | Qty: ${item.quantity}
   = ₹${item.product.price * item.quantity}`;
  });

  const lines = [
    `🛒 *Hello Zyle! I would like to checkout my cart items:*`,
    ``,
    ...itemLines,
    ``,
    `--------------------------`,
    `Subtotal: ₹${subtotal}`,
    `Delivery: ${shippingFee === 0 ? 'FREE (Above ₹999 Promo applied! 🎉)' : `₹${shippingFee}`}`,
    `💰 *Grand Total Payable: ₹${grandTotal}*`,
    `📦 *Mode:* Cash on Delivery (COD) / UPI on Delivery`,
    `--------------------------`,
    ``,
    `📍 *Deliver to:*`,
    `Name: `,
    `Address: `,
    `City / Pincode: `,
    `Contact Phone: `,
    ``,
    `Please verify item stock and dispatch from your Kota hub!`
  ];

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${text}`;
}

export function createFeedbackWhatsAppUrl(
  type: string,
  message: string,
  name?: string
): string {
  const phone = getWhatsAppNumberClean();
  const trimmedName = name?.trim();
  
  const lines = [
    'Zyle Feedback',
    `Type: ${type}`,
    ...(trimmedName ? [`Name: ${trimmedName}`] : []),
    `Message: ${message.trim()}`
  ];

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${text}`;
}

