
import { Category, Product, Coupon } from './types';

export const SHOP_NAME = "MobileHub";

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountPercent: 10, isActive: true },
  { code: 'SAVE20', discountPercent: 20, isActive: true },
];

export const PINCODE_DATA: Record<string, { type: 'Express' | 'Standard', days: number }> = {
  '395001': { type: 'Express', days: 1 },
  '380001': { type: 'Express', days: 1 },
  '360001': { type: 'Standard', days: 2 },
  '400001': { type: 'Standard', days: 3 },
};

export const TRANSLATIONS = {
  en: {
    shop_name: "MobileHub",
    hero_title: "Protect & Power Your Digital Life",
    hero_subtitle: "Discover premium glass covers, ultra-fast GaN chargers, and rugged cases.",
    shop_now: "Shop Collection",
    premium_collection: "Premium Collection",
    add_to_cart: "Add to Cart",
    check_delivery: "Check Delivery",
    enter_pincode: "Enter Pincode",
    protection_plan: "Mobile Shield Protection",
    protection_desc: "Cover your device against accidental damage for 1 year.",
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
    return_desc: "Hassle-free 7 days replacement if product is damaged or defective."
  },
  gu: {
    shop_name: "મોબાઇલ હબ",
    hero_title: "તમારા ડિજિટલ જીવનને સુરક્ષિત કરો",
    hero_subtitle: "પ્રીમિયમ ગ્લાસ કવર, અલ્ટ્રા-ફાસ્ટ ચાર્જર અને મજબૂત કેસ શોધો.",
    shop_now: "ખરીદી કરો",
    premium_collection: "પ્રીમિયમ કલેક્શન",
    add_to_cart: "કાર્ટમાં ઉમેરો",
    check_delivery: "ડિલિવરી તપાસો",
    enter_pincode: "પિનકોડ નાખો",
    protection_plan: "મોબાઇલ શીલ્ડ સુરક્ષા",
    protection_desc: "૧ વર્ષ માટે તમારા ઉપકરણને આકસ્મિક નુકસાન સામે સુરક્ષિત કરો.",
    orders: "ઓર્ડર",
    cart: "કાર્ટ",
    search_placeholder: "ચાર્જર, કવર શોધો...",
    flash_sale: "ફ્લેશ સેલ",
    style_matcher: "AI સ્ટાઇલ મેચર",
    verify_product: "અસલી પ્રોડક્ટ તપાસો",
    upload_outfit: "તમારા આઉટફિટનો ફોટો અપલોડ કરો",
    analyzing: "તમારી સ્ટાઇલ તપાસી રહ્યા છીએ...",
    certificate_title: "અસલી હોવાનું પ્રમાણપત્ર",
    verified_desc: "આ પ્રોડક્ટ ૧૦૦% અસલી મોબાઇલ હબ ગિયર તરીકે પ્રમાણિત છે.",
    return_policy: "૭ દિવસની રિટર્ન પોલિસી",
    return_desc: "જો પ્રોડક્ટમાં કોઈ ખામી હોય તો ૭ દિવસમાં આસાનીથી બદલી આપવામાં આવશે."
  },
  hi: {
    shop_name: "मोबाइल हब",
    hero_title: "अपने डिजिटल जीवन को सुरक्षित करें",
    hero_subtitle: "प्रीमियम ग्लास कवर, अल्ट्रा-फास्ट चार्जर और मजबूत केस खोजें।",
    shop_now: "अभी खरीदें",
    premium_collection: "प्रीमियम कलेक्शन",
    add_to_cart: "कार्ट में जोड़ें",
    check_delivery: "डिलीवरी चेक करें",
    enter_pincode: "पिनकोड दर्ज करें",
    protection_plan: "मोबाइल शील्ड सुरक्षा",
    protection_desc: "1 वर्ष के लिए अपने डिवाइस को आकस्मिक क्षति से सुरक्षित करें।",
    orders: "ऑर्डर",
    cart: "कार्ट",
    search_placeholder: "चार्जर, कवर खोजें...",
    flash_sale: "फ्लैश सेल",
    style_matcher: "AI स्टाइल मेचर",
    verify_product: "असली उत्पाद जांचें",
    upload_outfit: "अपने आउटफिट का फोटो अपलोड करें",
    analyzing: "आपकी शैली का विश्लेषण हो रहा है...",
    certificate_title: "प्रामाणिकता का प्रमाण पत्र",
    verified_desc: "यह उत्पाद 100% असली मोबाइल हब गियर के रूप में प्रमाणित है।"
  }
};

export const NOTIFICATION_NAMES = [
  "Jayeshbhai", "Rameshbhai", "Sureshbhai", "Amitbhai", "Priyaben", "Anjaliben", "Hardikbhai", "Parthbhai", 
  "Jigneshbhai", "Nileshbhai", "Sanjaybhai", "Vijaybhai", "Deepbhai", "Rajbhai", "Karanbhai", "Poojaben", 
  "Meghaben", "Hetalben", "Bhaveshbhai", "Manishbhai", "Pareshbhai", "Tusharbhai", "Akashbhai", "Ishitaben", 
  "Kavitaben", "Nehalben", "Darshanbhai", "Chiragbhai", "Mehulbhai", "Alpeshbhai", "Shaileshbhai", "Bharatbhai", 
  "Kishorbhai", "Ashokbhai", "Shantibhai", "Kokilaben", "Savitaben", "Binduben", "Reenaben", "Seemaben", 
  "Geetaben", "Babubhai", "Maganbhai", "Chhaganbhai", "Khimjibhai", "Lalitbhai", "Dhirubhai", "Nanubhai", 
  "Kanubhai", "Pankajbhai"
];

export const NOTIFICATION_CITIES = [
  "Ahmedabad", "Surat", "Rajkot", "Vadodara", "Jamnagar", "Bhavnagar", "Gandhinagar", "Junagadh", "Anand", 
  "Navsari", "Morbi", "Nadiad", "Bharuch", "Porbandar", "Valsad", "Vapi", "Gondal", "Jetpur", "Amreli", "Mehsana"
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'UltraFast 65W GaN Charger',
    description: 'Compact high-speed charger suitable for iPhone, Samsung, and Laptops.',
    price: 1999,
    category: Category.CHARGER,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    stock: 15,
    sales: 124,
    reviews: [
      { id: 'r1', userName: 'Rahul P.', rating: 5, comment: 'Best charger ever! Charges my laptop too.', date: '2023-10-15' }
    ]
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max Clear Case',
    description: 'Anti-yellowing transparent case with MagSafe support.',
    price: 799,
    category: Category.COVER,
    image: 'https://images.unsplash.com/photo-1603313011101-31c72ee78277?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    stock: 50,
    sales: 89,
    reviews: []
  },
  {
    id: '3',
    name: '9H Tempered Glass (2-Pack)',
    description: 'Edge-to-edge protection with oleophobic coating for scratch resistance.',
    price: 499,
    category: Category.GLASS,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d715b909?auto=format&fit=crop&w=400&q=80',
    rating: 4.2,
    stock: 100,
    sales: 250,
    reviews: []
  },
  {
    id: '4',
    name: 'Braided USB-C to Lightning Cable',
    description: 'Durable 2-meter nylon braided cable for fast data transfer.',
    price: 349,
    category: Category.CABLE,
    image: 'https://images.unsplash.com/photo-1625766127285-990f027239a3?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    stock: 30,
    sales: 65,
    reviews: []
  },
  {
    id: '5',
    name: 'Wireless Charging Pad 15W',
    description: 'Sleek wireless charger for desk setups. Supports Qi charging.',
    price: 1299,
    category: Category.CHARGER,
    image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=400&q=80',
    rating: 4.3,
    stock: 0,
    sales: 42,
    reviews: []
  },
  {
    id: '6',
    name: 'Rugged Armor Case Samsung S24',
    description: 'Military-grade drop protection with carbon fiber texture.',
    price: 899,
    category: Category.COVER,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    stock: 20,
    sales: 15,
    reviews: []
  }
];
