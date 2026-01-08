
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
import { signInAnonymously } from 'firebase/auth';
import { db, storage, auth } from './firebase';
import { Product, Order, User, Coupon, Review } from '../types';

const USERS_COLLECTION = 'users';
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const COUPONS_COLLECTION = 'coupons';

// Helper to ensure user is authenticated before writing data
const ensureAuth = async () => {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
      console.log("Signed in anonymously for database access");
    } catch (error: any) {
      // If Anonymous Auth is disabled in Console, we catch the error and proceed.
      // This allows the app to work if Firestore Rules are set to public (Test Mode).
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        console.warn("WARNING: Anonymous Auth disabled in Firebase Console. Attempting public access.");
        return; 
      }
      console.error("Auth Error:", error);
    }
  }
};

export const api = {
  // Check connection to Firestore
  checkHealth: async () => {
    try {
      await ensureAuth();
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
  seedProducts: async (products: Product[]): Promise<boolean> => {
    await ensureAuth();
    console.log("Attempting to seed database with", products.length, "products...");
    try {
      const batch = writeBatch(db);
      
      products.forEach((product) => {
        const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
        batch.set(docRef, product);
      });

      await batch.commit();
      console.log("Database seeded SUCCESSFULLY");
      return true;
    } catch (error: any) {
      console.error("Error seeding database:", error);
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
    await ensureAuth();
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
      return data;
    } catch (error) {
      console.error("Error getting products:", error);
      return null;
    }
  },

  addProduct: async (product: Product): Promise<Product | null> => {
    await ensureAuth();
    try {
      let imageUrl = product.image || "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=800&q=80";

      // Check if image is Base64 (starts with data:image) and upload to Storage
      if (product.image && product.image.startsWith('data:image')) {
        try {
          const timestamp = Date.now();
          const safeName = product.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
          const storageRef = ref(storage, `products/${timestamp}_${safeName}.jpg`);
          
          await uploadString(storageRef, product.image, 'data_url');
          imageUrl = await getDownloadURL(storageRef);
        } catch (storageError) {
          console.error("Storage upload failed, attempting fallback:", storageError);
          // Fallback: If image is small enough (< 800KB), save base64 directly to Firestore
          if (product.image.length < 800000) {
             imageUrl = product.image;
          } else {
             // If too big and storage failed, use a placeholder so product is still saved
             imageUrl = "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=800&q=80";
             console.warn("Image too large for Firestore fallback & Storage failed. Using placeholder.");
          }
        }
      }

      const productToSave = { ...product, image: imageUrl };
      
      const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
      await setDoc(docRef, productToSave);
      
      return productToSave;
    } catch (error: any) {
      console.error("Detailed Error adding product:", error.code, error.message);
      if (error.code === 'permission-denied') {
        alert("Permission Denied: Go to Firebase Console > Firestore Database > Rules and allow read/write access (or enable Anonymous Auth).");
      } else if (error.code === 'unavailable') {
        alert("Firebase Offline: Please check your internet connection.");
      }
      return null;
    }
  },

  updateStock: async (id: string, stock: number): Promise<boolean> => {
    await ensureAuth();
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
    await ensureAuth();
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
    await ensureAuth();
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  },

  updateOrderStatus: async (id: string, status: string): Promise<boolean> => {
    await ensureAuth();
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
    await ensureAuth();
    try {
      await setDoc(doc(db, COUPONS_COLLECTION, coupon.code), coupon);
      return true;
    } catch (e) {
      return false;
    }
  },

  deleteCoupon: async (code: string): Promise<boolean> => {
    await ensureAuth();
    try {
      await deleteDoc(doc(db, COUPONS_COLLECTION, code));
      return true;
    } catch (e) {
      return false;
    }
  }
};
