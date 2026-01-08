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
    stock: 50,
    sales: 120,
    reviews: []
  },
  {
    id: '2',
    name: 'Crystal Clear Case iPhone 15',
    description: 'Anti-yellowing transparent case with shock protection.',
    price: 499,
    category: Category.COVER,
    image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    stock: 100,
    sales: 300,
    reviews: []
  },
  {
    id: '3',
    name: 'Tempered Glass Screen Guard',
    description: '9H Hardness tough glass for ultimate screen protection.',
    price: 299,
    category: Category.GLASS,
    image: 'https://images.unsplash.com/photo-1629828453424-64b581b24479?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    stock: 200,
    sales: 500,
    reviews: []
  },
  {
    id: '4',
    name: 'Braided USB-C Cable 2M',
    description: 'Durable nylon braided cable for fast charging and data sync.',
    price: 399,
    category: Category.CABLE,
    image: 'https://images.unsplash.com/photo-1542848284-8afa78a08ccb?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    stock: 150,
    sales: 250,
    reviews: []
  },
  {
    id: '5',
    name: 'Wireless MagSafe Pad',
    description: 'Fast wireless charging pad compatible with all Qi devices.',
    price: 1499,
    category: Category.CHARGER,
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    stock: 80,
    sales: 150,
    reviews: []
  }
];

export const TRANSLATIONS: any = {
  en: {
    shop_name: "MobileHub",
    search_placeholder: "Search chargers, cases...",
    premium_collection: "Premium Collection",
    return_policy: "7 Days Return",
    next_day_dispatch: "Next Day Dispatch",
    add_to_cart: "Add to Cart",
    style_matcher: "AI Style Matcher",
    upload_outfit: "Upload your outfit photo to get matching cover suggestions!",
    analyzing: "AI is analyzing your style...",
    certificate_title: "Certificate of Authenticity",
    verify_product: "Verify Product",
    verified_desc: "This product is verified as 100% Original.",
    hero_badge: "Premium Gear 2026",
    hero_title_1: "Chargers, Glass",
    hero_title_2: "& Covers",
    hero_desc: "Discover high-performance chargers, tough glass screen guards, and stylish covers. Delivered to your doorstep fast.",
    shop_now: "Shop Accessories"
  },
  gu: {
    shop_name: "મોબાઇલ હબ",
    search_placeholder: "ચાર્જર, કેસ શોધો...",
    premium_collection: "પ્રીમિયમ કલેક્શન",
    return_policy: "૭ દિવસ રિટર્ન",
    next_day_dispatch: "બીજા દિવસે ડિસ્પેચ",
    add_to_cart: "કાર્ટમાં ઉમેરો",
    style_matcher: "સ્ટાઇલ મેચર",
    upload_outfit: "તમારા ફોટા અપલોડ કરો, અમે મેચિંગ કવર બતાવીશું!",
    analyzing: "AI તમારી સ્ટાઇલ તપાસી રહ્યું છે...",
    certificate_title: "અસલિયતનું પ્રમાણપત્ર",
    verify_product: "પ્રોડક્ટ તપાસો",
    verified_desc: "આ પ્રોડક્ટ ૧૦૦% અસલી હોવાની પુષ્ટિ થઈ છે.",
    hero_badge: "પ્રીમિયમ એસેસરીઝ ૨૦૨૬",
    hero_title_1: "ચાર્જર, ગ્લાસ",
    hero_title_2: "અને કવર",
    hero_desc: "તમારા મોબાઈલ માટે બેસ્ટ ક્વોલિટીના ચાર્જર, મજબૂત ગ્લાસ અને સ્ટાઇલિશ કવર. ઝડપી હોમ ડિલિવરી.",
    shop_now: "ખરીદી કરો"
  }
};