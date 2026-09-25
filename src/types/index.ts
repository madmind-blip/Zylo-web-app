export type ProductCategory = 'combos' | 'watches' | 'tops' | 'bottoms' | string;

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: string;
  categoryGroup: 'combos' | 'watches' | 'other';
  price: number;
  originalPrice: number;
  discountPercent: number;
  stock: number; // 0: sold out, 1-5: "Only X left", >5: in stock
  images: string[];
  sizes: string[];
  isFreeSize?: boolean;
  colors?: string[];
  description: string;
  details: string[];
  tags: string[];
  isNewArrival?: boolean;
  featured?: boolean;
  comboRole?: 'top' | 'bottom' | 'watch'; // for combo builder
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  quantity: number;
  isCustomCombo?: boolean;
  comboItems?: {
    top: { name: string; size: string };
    bottom: { name: string; size: string };
    watch: { name: string };
  };
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
