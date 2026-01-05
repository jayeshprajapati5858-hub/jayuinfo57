
import { Category, Product, Coupon } from './types';

export const SHOP_NAME = "MobileHub";

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountPercent: 10, isActive: true },
  { code: 'SAVE20', discountPercent: 20, isActive: true },
];

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
    image: 'https://picsum.photos/400/400?random=1',
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
    image: 'https://picsum.photos/400/400?random=2',
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
    image: 'https://picsum.photos/400/400?random=3',
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
    image: 'https://picsum.photos/400/400?random=4',
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
    image: 'https://picsum.photos/400/400?random=5',
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
    image: 'https://picsum.photos/400/400?random=6',
    rating: 4.9,
    stock: 20,
    sales: 15,
    reviews: []
  },
  {
    id: '7',
    name: 'Privacy Screen Guard',
    description: 'Keep your screen content safe from prying eyes.',
    price: 599,
    category: Category.GLASS,
    image: 'https://picsum.photos/400/400?random=7',
    rating: 4.1,
    stock: 45,
    sales: 78,
    reviews: []
  },
  {
    id: '8',
    name: 'True Wireless Earbuds Pro',
    description: 'Active Noise Cancellation and 24-hour battery life.',
    price: 2499,
    category: Category.AUDIO,
    image: 'https://picsum.photos/400/400?random=8',
    rating: 4.7,
    stock: 8,
    sales: 110,
    reviews: []
  }
];
