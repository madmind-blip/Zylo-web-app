import { FAQItem } from '../types';

export const BRAND = {
  name: 'Zyle',
  tagline: 'Premium look, pocket price',
  whatsappNumber: '+917073765833',
  whatsappDisplay: '+91 7073765833',
  location: 'Kota, Rajasthan',
  fullAddress: 'Zyle Fashion Hub, Vigyan Nagar & Aerodrome Circle Road, Kota, Rajasthan 324005',
  deliveryThreshold: 999, // Free delivery above ₹999
  standardShippingFee: 150,
  codFee: 0, // Free COD
  instagramHandle: '@zyle.store_',
  instagramUrl: 'https://instagram.com/zyle.store_',
};

export const FAQS: FAQItem[] = [
  {
    category: 'Delivery',
    question: 'How fast is delivery & what are the charges?',
    answer: 'We dispatch all orders within 24 hours directly from Kota, Rajasthan! Orders in Kota & Rajasthan arrive in 24–48 hours. Rest of India takes 3–5 working days. Delivery is completely FREE on all orders above ₹999 (nominal ₹150 under ₹999).'
  },
  {
    category: 'Ordering',
    question: 'How do I place an order through WhatsApp? Is it safe?',
    answer: 'It is 100% safe, fast, and personal! Simply pick your items or build your combo, click "Order on WhatsApp", and your cart details are automatically formatted into a clear WhatsApp message for our team at +91 7073765833. Our team confirms your address, shares live dispatch tracking, and you can pay via Cash on Delivery (COD) or UPI on arrival.'
  },
  {
    category: 'Payment',
    question: 'Is Cash on Delivery (COD) available?',
    answer: 'Yes! Cash on Delivery is available across 19,000+ pincodes across India. You only pay when your parcel reaches your doorstep and you inspect the tamper-proof outer package.'
  },
  {
    category: 'Returns',
    question: 'What is your return & size exchange policy?',
    answer: 'We offer a 7-day hassle-free size exchange policy. If your tee or cargo is too tight or loose, simply WhatsApp us at +91 7073765833 with your order photo, and we will arrange a reverse pickup or size swap immediately. No questions asked.'
  },
  {
    category: 'Sizing',
    question: 'How do I choose the right size? Are tops oversized?',
    answer: 'All our streetwear t-shirts are designed with a relaxed, dropped-shoulder boxy fit. Order your standard regular size for the signature streetwear drape. If you prefer a snug fitted look, you can choose one size down.'
  },
  {
    category: 'Watches',
    question: 'Are Zyle watches water-resistant and durable?',
    answer: 'Yes! All Zyle watches feature Japanese quartz movements, hardened mineral scratch-resistant glass, and 30M splash resistance (safe for daily rain, handwashing, and sweat). Each watch undergoes rigorous 48-hour timekeeping inspection in Kota before shipping.'
  }
];
