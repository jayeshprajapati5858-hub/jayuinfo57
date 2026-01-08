
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
  if (auth.currentUser) return;
  
  try {
    await signInAnonymously(auth);
    console.log("Signed in anonymously for database access");
  } catch (error: any) {
    console.error("Auth Error:", error);
    // Continue even if auth fails, as rules might be public
  }
};

// Helper for timeout
const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms));

export const api = {
  // Check connection to Firestore
  checkHealth: async () => {
    try {
      await ensureAuth();
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
    console.log("Attempting to seed database...");
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

      // Handle Image Upload
      if (product.image && product.image.startsWith('data:image')) {
        try {
          // Attempt Storage Upload with 5s timeout race
          // If storage takes too long or fails, we fall back to base64
          const timestamp = Date.now();
          const safeName = product.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
          const storageRef = ref(storage, `products/${timestamp}_${safeName}.jpg`);
          
          await Promise.race([
            uploadString(storageRef, product.image, 'data_url'),
            timeout(5000) // 5 second timeout
          ]);
          
          imageUrl = await getDownloadURL(storageRef);
        } catch (storageError: any) {
          console.error("Storage upload failed or timed out:", storageError);
          // Fallback: Use Base64 if small, else placeholder
          if (product.image.length < 500000) { // Limit to ~500KB for Firestore safety
             imageUrl = product.image;
             console.log("Falling back to Base64 storage");
          } else {
             console.warn("Image too large for Firestore fallback. Using placeholder.");
             imageUrl = "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=800&q=80";
             alert("Warning: Image upload failed (Network/Storage issue) and image was too large for database. A placeholder image was used.");
          }
        }
      }

      const productToSave = { ...product, image: imageUrl };
      
      // Save to Firestore
      const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
      await setDoc(docRef, productToSave);
      
      return productToSave;

    } catch (error: any) {
      console.error("Detailed Error adding product:", error);
      
      let msg = "Failed to add product. ";
      if (error.code === 'permission-denied') {
        msg += "PERMISSION DENIED: Go to Firebase Console -> Firestore Database -> Rules. Change 'allow read, write: if false;' to 'allow read, write: if true;'";
      } else if (error.code === 'unavailable') {
        msg += "Network Error. Please check your internet.";
      } else {
        msg += error.message;
      }
      alert(msg);
      
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
