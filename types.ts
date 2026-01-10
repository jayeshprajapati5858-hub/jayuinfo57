
export enum Category {
  CHARGER = 'Chargers',
  COVER = 'Covers',
  GLASS = 'Screen Guards',
  AUDIO = 'Audio',
  CABLE = 'Cables'
}

export type Language = 'en' | 'gu';

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Office"
  details: string; // Full address string
  city: string;
  zip: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  joinDate: string;
  addresses?: Address[]; // Added address book
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  images: string[];
  colors: string[];
  rating: number;
  stock: number;
  sales: number;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Rejected';

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  discount: number;
  finalTotal: number;
  date: string;
  status: OrderStatus;
  address: string;
  coinsEarned?: number;
  verificationCode?: string;
  paymentMethod?: 'COD' | 'UPI'; // Added payment method
  paymentStatus?: 'Pending' | 'Paid'; // Added payment status
  paymentScreenshot?: string; // Added payment proof
}

export interface Coupon {
  code: string;
  discountPercent: number;
  isActive: boolean;
}

export interface Announcement {
  message: string;
  isActive: boolean;
}
