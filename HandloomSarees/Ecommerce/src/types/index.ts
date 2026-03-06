export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Saree {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  fabric: 'Silk' | 'Cotton' | 'Linen' | 'Khadi';
  occasion: 'Wedding' | 'Casual' | 'Festive' | 'Party';
  color: string;
  images: string[];
  description: string;
  weavingTechnique: string;
  artisanDetails: string;
  careInstructions: string;
  length: string;
  blousePiece: boolean;
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
}

export interface CartItem {
  saree: Saree;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  discount: number;
  finalTotal: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface FilterOptions {
  fabrics: string[];
  occasions: string[];
  colors: string[];
  priceRange: [number, number];
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}

export interface FashionAdvisor {
  id: string;
  name: string;
  image: string;
  specialization: string[];
  experience: number;
  rating: number;
  totalConsultations: number;
  languages: string[];
  availability: string[];
  bio: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface VideoConsultation {
  id: string;
  userId: string;
  advisorId: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  sareePreferences?: {
    occasion?: string;
    fabric?: string;
    priceRange?: string;
    colorPreference?: string;
  };
  notes?: string;
  createdAt: string;
}
