
import { Category, Product, Coupon } from './types';

export const SHOP_NAME = "MobileHub";

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountPercent: 10, isActive: true },
  { code: 'JAYSHREE', discountPercent: 20, isActive: true },
];

export const NOTIFICATION_NAMES = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohan", "Kavita"];
export const NOTIFICATION_CITIES = ["Mumbai", "Delhi", "Bangalore", "Ahmedabad", "Surat", "Pune", "Chennai", "Kolkata"];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'UltraFast GaN Charger 65W',
    description: 'Compact and powerful GaN charger for all your devices.',
    price: 1999,
    category: Category.CHARGER,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    stock: 20,
    sales: 150,
    reviews: []
  },
  {
    id: '2',
    name: 'Crystal Clear Glass - iPhone 14',
    description: '9H Hardness toughened glass for ultimate protection.',
    price: 499,
    category: Category.GLASS,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca63a16d?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    stock: 50,
    sales: 300,
    reviews: []
  },
  {
    id: '3',
    name: 'Rugged Armor Case - S24 Ultra',
    description: 'Heavy duty protection with stylish look.',
    price: 799,
    category: Category.COVER,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    stock: 35,
    sales: 120,
    reviews: []
  },
   {
    id: '4',
    name: 'Braided Type-C Cable',
    description: 'Durable and fast data transfer cable.',
    price: 299,
    category: Category.CABLE,
    image: 'https://images.unsplash.com/photo-1555543451-ee268f8e8157?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    stock: 100,
    sales: 500,
    reviews: []
  }
];

export const TRANSLATIONS: Record<string, any> = {
  en: {
    shop_name: "MobileHub",
    search_placeholder: "Search for chargers, cases...",
    hero_title_1: "Premium Mobile",
    hero_title_2: "Accessories",
    hero_desc: "Upgrade your device with our high-quality chargers, protective glass, and stylish covers.",
    hero_badge: "Fast Delivery",
    shop_now: "Shop Now",
    premium_collection: "Premium Collection",
    add_to_cart: "Add to Cart",
    return_policy: "7 Day Replacement",
    next_day_dispatch: "Next Day Dispatch",
    style_matcher: "AI Style Matcher",
    upload_outfit: "Upload your outfit to find matching cases",
    analyzing: "Analyzing...",
    verify_product: "Verify Authenticity",
    certificate_title: "Authenticity Certificate",
    verified_desc: "This product is 100% Original.",
    categories: {
      [Category.CHARGER]: "Fast Chargers",
      [Category.COVER]: "Stylish Covers",
      [Category.GLASS]: "Toughened Glass",
      [Category.AUDIO]: "Audio Gear",
      [Category.CABLE]: "Data Cables"
    }
  },
  gu: {
    shop_name: "MobileHub",
    search_placeholder: "ચાર્જર, કવર શોધો...",
    hero_title_1: "શ્રેષ્ઠ મોબાઈલ",
    hero_title_2: "એસેસરીઝ",
    hero_desc: "તમારા મોબાઈલ માટે બેસ્ટ ચાર્જર, ગ્લાસ અને કવર. આજે જ ઓર્ડર કરો.",
    hero_badge: "ઝડપી ડિલિવરી",
    shop_now: "ખરીદી કરો",
    premium_collection: "નવું કલેક્શન",
    add_to_cart: "કાર્ટમાં ઉમેરો",
    return_policy: "7 દિવસમાં બદલી અપાશે",
    next_day_dispatch: "બીજા દિવસે રવાના",
    style_matcher: "AI સ્ટાઈલ મેચર",
    upload_outfit: "તમારા કપડાંનો ફોટો અપલોડ કરો",
    analyzing: "ચકાસણી ચાલુ છે...",
    verify_product: "પ્રોડક્ટ વેરીફાઈ કરો",
    certificate_title: "અસલ પ્રોડક્ટ સર્ટીફીકેટ",
    verified_desc: "આ પ્રોડક્ટ 100% ઓરીજીનલ છે.",
    categories: {
      [Category.CHARGER]: "ફાસ્ટ ચાર્જર",
      [Category.COVER]: "મોબાઈલ કવર",
      [Category.GLASS]: "ટફન ગ્લાસ",
      [Category.AUDIO]: "હેડફોન/સ્પીકર",
      [Category.CABLE]: "કેબલ્સ"
    }
  }
};
