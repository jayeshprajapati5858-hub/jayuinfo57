
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
    description: 'Experience the future of charging with our UltraFast GaN Charger 65W. Designed for the modern tech enthusiast, this charger utilizes Gallium Nitride (GaN) technology to deliver high-speed power in a compact form factor. Unlike traditional silicon chargers, GaN technology allows for higher efficiency and cooler operation. It is compatible with a wide range of devices including MacBooks, iPads, iPhones, and Android smartphones. The intelligent chip inside protects your device from over-heating, over-charging, and short circuits. Perfect for travel or home use, this charger ensures your devices are ready to go whenever you are.',
    price: 1999,
    category: Category.CHARGER,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'],
    colors: ['White', 'Black'],
    rating: 4.8,
    stock: 20,
    sales: 150,
    reviews: []
  },
  {
    id: '2',
    name: 'Crystal Clear Glass - iPhone 14',
    description: 'Protect your valuable investment with our Premium Crystal Clear Tempered Glass for iPhone 14. Engineered with 9H hardness, this screen guard offers superior resistance against scratches, drops, and daily wear and tear. The high-transparency glass ensures that your display remains vivid and sharp, providing an original viewing experience. It features an oleophobic coating that repels fingerprints and smudges, keeping your screen clean at all times. The installation is bubble-free and effortless. Don’t compromise on safety; choose the best protection for your iPhone’s display today.',
    price: 499,
    category: Category.GLASS,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca63a16d?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1592899677977-9c10ca63a16d?auto=format&fit=crop&w=800&q=80'],
    colors: ['Transparent'],
    rating: 4.5,
    stock: 50,
    sales: 300,
    reviews: []
  },
  {
    id: '3',
    name: 'Rugged Armor Case - S24 Ultra',
    description: 'Give your Samsung Galaxy S24 Ultra the ultimate protection it deserves with our Rugged Armor Case. This heavy-duty cover is designed to withstand extreme conditions, featuring shock-absorbing corners and a raised bezel to protect the camera and screen. The textured back provides a non-slip grip, preventing accidental drops. Despite its rugged nature, the case supports wireless charging and offers precise cutouts for the S-Pen and charging ports. Available in multiple stylish colors, this case combines durability with a sleek, modern aesthetic suitable for any environment.',
    price: 799,
    category: Category.COVER,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80'],
    colors: ['Black', 'Navy Blue', 'Dark Green'],
    rating: 4.7,
    stock: 35,
    sales: 120,
    reviews: []
  },
   {
    id: '4',
    name: 'Braided Type-C Cable',
    description: 'Upgrade your charging setup with our Premium Braided Type-C Data Cable. Built to last, this cable features a nylon-braided exterior that prevents tangling and breakage, ensuring a lifespan 10x longer than standard cables. It supports fast charging protocols and high-speed data transfer, allowing you to sync photos and videos in seconds. The reinforced connectors are tested to withstand thousands of bends. Whether you are charging your phone, tablet, or laptop, this versatile cable delivers reliable performance and durability you can count on.',
    price: 299,
    category: Category.CABLE,
    image: 'https://images.unsplash.com/photo-1555543451-ee268f8e8157?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1555543451-ee268f8e8157?auto=format&fit=crop&w=800&q=80'],
    colors: ['Red', 'Black'],
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
  }
};
