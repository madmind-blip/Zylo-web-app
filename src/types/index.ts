export type ProductCategory = 'combos' | 'watches' | 'tops' | 'bottoms';

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  stock: number; // 0: sold out, 1-5: "Only X left", >5: in stock
  images: string[];
  sizes?: string[]; // clothing sizes e.g. ['S', 'M', 'L', 'XL'] or watch strap ['Free Size (Adjustable)']
  colors?: string[];
  description: string;
  details: string[];
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

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  productBought: string;
  comment: string;
  verified: boolean;
  tag: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
