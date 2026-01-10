
export enum Category {
  CHARGER = 'Chargers',
  COVER = 'Covers',
  GLASS = 'Screen Guards',
  AUDIO = 'Audio',
  CABLE = 'Cables'
}

export type Language = 'en' | 'gu'; // Added 'gu' for Gujarati

export interface User {
  id: string;
  name: string;
  email?: string; // Made optional
  phoneNumber?: string; // Added for OTP login
  password?: string; // Made optional
  joinDate: string;
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
  image: string; // Main thumbnail
  images: string[]; // Gallery images
  colors: string[]; // Available colors
  rating: number;
  stock: number;
  sales: number;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string; // Color chosen by user
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
