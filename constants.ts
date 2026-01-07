
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
    name: 'Wireless Earbuds Pro',
    description: 'Active Noise Cancellation and 30-hour battery life.',
    price: 2499,
    category: Category.AUDIO,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    stock: 75,
    sales: 150,
    reviews: []
  }
];

export const TRANSLATIONS = {
  en: {
    shop_name: "MobileHub",
    search_placeholder: "Search for chargers, cases...",
    next_day_dispatch: "Next Day Dispatch",
    premium_collection: "Premium Collection",
    return_policy: "7 Days Return",
    add_to_cart: "Add to Cart",
    style_matcher: "AI Style Matcher",
    upload_outfit: "Upload your outfit to get matching accessories",
    analyzing: "Analyzing your style...",
    certificate_title: "Certificate of Authenticity",
    verified_desc: "This product is verified authentic.",
    verify_product: "Verify Product",
  },
  gu: {
    shop_name: "મોબાઈલ હબ",
    search_placeholder: "ચાર્જર, કેસ શોધો...",
    next_day_dispatch: "બીજા દિવસે રવાનગી",
    premium_collection: "પ્રીમિયમ કલેક્શન",
    return_policy: "7 દિવસમાં રિટર્ન",
    add_to_cart: "કાર્ટમાં ઉમેરો",
    style_matcher: "AI સ્ટાઇલ મેચર",
    upload_outfit: "મેચિંગ એક્સેસરીઝ મેળવવા માટે તમારો ફોટો અપલોડ કરો",
    analyzing: "તમારી શૈલીનું વિશ્લેષણ કરી રહ્યા છીએ...",
    certificate_title: "પ્રમાણભૂતતાનું પ્રમાણપત્ર",
    verified_desc: "આ ઉત્પાદન ચકાસાયેલ અસલી છે.",
    verify_product: "ઉત્પાદન ચકાસો",
  }
};
