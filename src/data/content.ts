import { Review, FAQItem } from '../types';

export const BRAND = {
  name: 'Zyle',
  tagline: 'Premium look, pocket price',
  whatsappNumber: '+917073765833',
  whatsappDisplay: '+91 7073765833',
  location: 'Kota, Rajasthan',
  fullAddress: 'Zyle Fashion Hub, Vigyan Nagar & Aerodrome Circle Road, Kota, Rajasthan 324005',
  deliveryThreshold: 999, // Free delivery above ₹999
  standardShippingFee: 69,
  codFee: 0, // Free COD
  instagramHandle: '@zyle',
  instagramUrl: 'https://instagram.com/zyle',
};

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Aryan Sharma',
    city: 'Kota, Rajasthan',
    rating: 5,
    date: '3 days ago',
    productBought: 'Stealth Urban Streetwear Combo',
    comment: 'Bhai the quality is unbelievable for this price! 240 GSM heavy tee hangs like high-end Zara/H&M studio drop. Got it delivered in Kota within 24 hours. Ordered on WhatsApp directly, super smooth.',
    verified: true,
    tag: 'Verified Kota Buyer'
  },
  {
    id: 'rev-2',
    name: 'Rishabh Meena',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    date: '1 week ago',
    productBought: 'Zyle Royal Sunburst Gold Watch',
    comment: 'The watch looks like easily a 15,000 to 20,000 rupee luxury watch on my wrist! Sunburst dial shines brilliantly under sunlight. Even the weight feels premium, not cheap plastic.',
    verified: true,
    tag: 'Verified Buyer'
  },
  {
    id: 'rev-3',
    name: 'Divyansh Verma',
    city: 'Kota (Vigyan Nagar)',
    rating: 5,
    date: '1 week ago',
    productBought: 'Old Money Linen Resort Combo',
    comment: 'Wore the waffle shirt on my birthday and literally 6 people asked where I got it from. The pocket price tagline is 100% genuine. Pocket-friendly + premium drip.',
    verified: true,
    tag: 'Verified Kota Local'
  },
  {
    id: 'rev-4',
    name: 'Harshil Patidar',
    city: 'Indore, MP',
    rating: 5,
    date: '2 weeks ago',
    productBought: 'Stealth Tactical Chrono Watch',
    comment: 'Tactical chrono is heavy and matte black finish is dope! Matte strap is sweatproof for gym. COD reached in 3 days with safe bubble packing.',
    verified: true,
    tag: 'Verified Buyer'
  },
  {
    id: 'rev-5',
    name: 'Rohan Choudhary',
    city: 'Jodhpur, Rajasthan',
    rating: 5,
    date: '3 weeks ago',
    productBought: 'Custom Combo Builder (3 Pieces)',
    comment: 'Used their Combo Builder tool to pick an oversized tee + black cargo + emerald watch. Saved an extra 10% combo discount! WhatsApp order was confirmed in 5 minutes.',
    verified: true,
    tag: 'Combo Builder Buyer'
  },
  {
    id: 'rev-6',
    name: 'Amit Singhal',
    city: 'Delhi NCR',
    rating: 5,
    date: '1 month ago',
    productBought: 'Emerald Roman Imperial Mesh Watch',
    comment: 'The magnetic gold mesh strap snaps effortlessly. That deep bottle green dial is so captivating. Outstanding value under ₹500.',
    verified: true,
    tag: 'Verified Buyer'
  }
];

export const FAQS: FAQItem[] = [
  {
    category: 'Delivery',
    question: 'How fast is delivery & what are the charges?',
    answer: 'We dispatch all orders within 24 hours directly from Kota, Rajasthan! Orders in Kota & Rajasthan arrive in 24–48 hours. Rest of India takes 3–5 working days. Delivery is completely FREE on all orders above ₹999 (nominal ₹69 under ₹999).'
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
