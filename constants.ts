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
    stock: 30,
    sales: 80,
    reviews: []
  },
  {
      id: '6',
      name: 'MagSafe Power Bank 10000mAh',
      description: 'Magnetic wireless power bank for iPhone 12/13/14/15 series.',
      price: 2999,
      category: Category.CHARGER,
      image: 'https://images.unsplash.com/photo-1616423641743-4f9e03d3f278?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      stock: 40,
      sales: 150,
      reviews: []
  }
];

export const TRANSLATIONS = {
  en: {
    shop_name: "MobileHub",
    hero_title: "Protect & Power Your Digital Life",
    hero_subtitle: "Discover premium glass covers, ultra-fast GaN chargers, and rugged cases.",
    shop_now: "Shop Collection",
    premium_collection: "Premium Collection",
    add_to_cart: "Add to Cart",
    orders: "Orders",
    cart: "Cart",
    search_placeholder: "Search chargers, cases...",
    flash_sale: "Flash Sale",
    style_matcher: "AI Style Matcher",
    verify_product: "Verify Authenticity",
    upload_outfit: "Upload Outfit Photo",
    analyzing: "Analyzing your style...",
    certificate_title: "Certificate of Authenticity",
    verified_desc: "This product is verified as 100% original MobileHub gear.",
    return_policy: "7 Days Return Policy",
    return_desc: "Hassle-free 7 days replacement if product is damaged or defective.",
    next_day_dispatch: "⚡ Next Day Dispatch",
    order_via_whatsapp: "Order via WhatsApp",
    whatsapp_skip_form: "Skip the form? Chat & Order instantly."
  },
  gu: {
    shop_name: "મોબાઈલ હબ",
    hero_title: "તમારા મોબાઈલ માટે બેસ્ટ એસેસરીઝ",
    hero_subtitle: "પ્રીમિયમ ગ્લાસ કવર, ફાસ્ટ ચાર્જર અને મજબૂત કેસ ખરીદો.",
    shop_now: "ખરીદી કરો",
    premium_collection: "નવું કલેક્શન",
    add_to_cart: "કાર્ટમાં ઉમેરો",
    orders: "ઓર્ડર",
    cart: "કાર્ટ",
    search_placeholder: "ચાર્જર, કવર શોધો...",
    flash_sale: "ફ્લેશ સેલ",
    style_matcher: "AI સ્ટાઈલ મેચર",
    verify_product: "પ્રોડક્ટ ચેક કરો",
    upload_outfit: "ફોટો અપલોડ કરો",
    analyzing: "ચેક કરી રહ્યું છે...",
    certificate_title: "અસલ પ્રોડક્ટ સર્ટિફિકેટ",
    verified_desc: "આ પ્રોડક્ટ 100% ઓરિજિનલ મોબાઈલ હબની છે.",
    return_policy: "7 દિવસની રિટર્ન પોલિસી",
    return_desc: "જો પ્રોડક્ટમાં ખામી હોય તો 7 દિવસમાં બદલી આપવામાં આવશે.",
    next_day_dispatch: "⚡ બીજા દિવસે ડિસ્પેચ",
    order_via_whatsapp: "વોટ્સએપ દ્વારા ઓર્ડર કરો",
    whatsapp_skip_form: "ફોર્મ ભરવું નથી? સીધો ચેટ કરો."
  }
};