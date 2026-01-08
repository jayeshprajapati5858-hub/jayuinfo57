
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  setDoc, 
  query, 
  orderBy,
  getDoc,
  limit,
  writeBatch
} from 'firebase/firestore';
import { 
  ref, 
  uploadString, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Product, Order, User, Coupon, Review } from '../types';

const USERS_COLLECTION = 'users';
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const COUPONS_COLLECTION = 'coupons';

export const api = {
  // Check connection to Firestore
  checkHealth: async () => {
    try {
      // Optimized ping
      const q = query(collection(db, PRODUCTS_COLLECTION), limit(1));
      await getDocs(q);
      console.log("Firebase Health Check: SUCCESS");
      return true;
    } catch (e: any) {
      console.error("Firebase Health Check FAILED:", e.message);
      return false;
    }
  },

  // --- DATABASE SEEDING ---
  // This uploads all local default products to Firebase if the DB is empty
  seedProducts: async (products: Product[]): Promise<boolean> => {
    console.log("Attempting to seed database with", products.length, "products...");
    try {
      const batch = writeBatch(db);
      
      products.forEach((product) => {
        // Create a reference with the specific ID
        const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
        batch.set(docRef, product);
      });

      await batch.commit();
      console.log("Database seeded SUCCESSFULLY");
      return true;
    } catch (error: any) {
      console.error("Error seeding database:", error);
      if (error.code === 'permission-denied') {
        console.error("PERMISSION DENIED: Check your Firestore Security Rules in Firebase Console.");
      }
      return false;
    }
  },

  // --- USERS ---
  getUsers: async (): Promise<User[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  },

  createUser: async (user: User): Promise<User | null> => {
    try {
      const userRef = doc(collection(db, USERS_COLLECTION));
      const newUser = { ...user, id: userRef.id };
      await setDoc(userRef, newUser);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  },

  // --- PRODUCTS ---
  getProducts: async (): Promise<Product[] | null> => {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('name')); 
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
      console.log("Fetched products from Firebase:", data.length);
      return data;
    } catch (error) {
      console.error("Error getting products:", error);
      return null;
    }
  },

  addProduct: async (product: Product): Promise<Product | null> => {
    try {
      let imageUrl = product.image;

      // Check if image is Base64 (starts with data:image) and upload to Storage
      if (imageUrl && imageUrl.startsWith('data:image')) {
        try {
          const timestamp = Date.now();
          const safeName = product.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
          const storageRef = ref(storage, `products/${timestamp}_${safeName}.jpg`);
          
          await uploadString(storageRef, imageUrl, 'data_url');
          imageUrl = await getDownloadURL(storageRef);
        } catch (storageError) {
          console.error("Storage upload failed, attempting fallback:", storageError);
          // Fallback: If image is small enough (< 800KB), save base64 directly to Firestore
          // Otherwise use a placeholder to prevent saving failure
          if (imageUrl.length > 800000) {
             imageUrl = "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=800&q=80";
             console.warn("Image too large for Firestore fallback. Using placeholder.");
          }
        }
      }

      const productToSave = { ...product, image: imageUrl };
      
      const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
      await setDoc(docRef, productToSave);
      
      return productToSave;
    } catch (error) {
      console.error("Error adding product:", error);
      return null;
    }
  },

  updateStock: async (id: string, stock: number): Promise<boolean> => {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(productRef, { stock });
      return true;
    } catch (error) {
      console.error("Error updating stock:", error);
      return false;
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  },

  // --- ORDERS ---
  getOrders: async (): Promise<Order[]> => {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
    } catch (error) {
      console.error("Error getting orders:", error);
      return [];
    }
  },

  createOrder: async (order: Order): Promise<Order | null> => {
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  },

  updateOrderStatus: async (id: string, status: string): Promise<boolean> => {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, id);
      await updateDoc(orderRef, { status });
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  },

  // --- COUPONS ---
  getCoupons: async (): Promise<Coupon[]> => {
    try {
      const snapshot = await getDocs(collection(db, COUPONS_COLLECTION));
      return snapshot.docs.map(doc => doc.data() as Coupon);
    } catch (e) {
      return [];
    }
  },

  addCoupon: async (coupon: Coupon): Promise<boolean> => {
    try {
      await setDoc(doc(db, COUPONS_COLLECTION, coupon.code), coupon);
      return true;
    } catch (e) {
      return false;
    }
  },

  deleteCoupon: async (code: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, COUPONS_COLLECTION, code));
      return true;
    } catch (e) {
      return false;
    }
  }
};
