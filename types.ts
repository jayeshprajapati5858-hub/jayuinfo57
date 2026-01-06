
export enum Category {
  CHARGER = 'Chargers',
  COVER = 'Covers',
  GLASS = 'Screen Guards',
  AUDIO = 'Audio',
  CABLE = 'Cables'
}

export type Language = 'en' | 'gu' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  joinDate: string;
}

export interface ProtectionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
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
  rating: number;
  stock: number;
  sales: number;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  protectionPlan?: ProtectionPlan;
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
