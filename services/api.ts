
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
  writeBatch,
  arrayUnion
} from 'firebase/firestore';
import { 
  ref, 
  uploadString, 
  getDownloadURL 
} from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import { db, storage, auth } from './firebase';
import { Product, Order, User, Coupon, Review, Announcement } from '../types';

const USERS_COLLECTION = 'users';
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const COUPONS_COLLECTION = 'coupons';
const SETTINGS_COLLECTION = 'settings';
const ANNOUNCEMENT_DOC_ID = 'global_announcement';

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
      // Logic for handling multiple images
      let uploadedImages: string[] = [];
      
      // If product has images array with Base64 strings, upload them
      if (product.images && product.images.length > 0) {
        // Check if the first image is a data URL (new upload) or already a URL (existing/seeded)
        if (product.images[0].startsWith('data:image')) {
            console.log("Uploading multiple images...");
            
            const uploadPromises = product.images.map(async (imgBase64, index) => {
                try {
                    const timestamp = Date.now();
                    const safeName = product.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15);
                    const storageRef = ref(storage, `products/${timestamp}_${safeName}_${index}.jpg`);
                    
                    await Promise.race([
                        uploadString(storageRef, imgBase64, 'data_url'),
                        timeout(10000) // 10 second timeout for multiple
                    ]);
                    return await getDownloadURL(storageRef);
                } catch (e) {
                    console.error("Failed to upload image index " + index, e);
                    // Fallback to base64 if upload fails, though ideally we want URL
                    return imgBase64.length < 500000 ? imgBase64 : "https://via.placeholder.com/400?text=UploadFailed"; 
                }
            });

            uploadedImages = await Promise.all(uploadPromises);
        } else {
            // Already URLs
            uploadedImages = product.images;
        }
      } else {
          // Fallback placeholder
           uploadedImages = ["https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=800&q=80"];
      }

      // Ensure main image is set
      const mainImage = uploadedImages[0];

      const productToSave = { 
          ...product, 
          image: mainImage,
          images: uploadedImages 
      };
      
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

  addReview: async (productId: string, review: Review): Promise<boolean> => {
    await ensureAuth();
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(productRef, {
        reviews: arrayUnion(review)
      });
      return true;
    } catch (error) {
      console.error("Error adding review:", error);
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
  },

  // --- ANNOUNCEMENT ---
  getAnnouncement: async (): Promise<Announcement | null> => {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, ANNOUNCEMENT_DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Announcement;
      }
      return null;
    } catch (e) {
      console.error("Error fetching announcement", e);
      return null;
    }
  },

  updateAnnouncement: async (announcement: Announcement): Promise<boolean> => {
    await ensureAuth();
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, ANNOUNCEMENT_DOC_ID);
      await setDoc(docRef, announcement);
      return true;
    } catch (e) {
      console.error("Error updating announcement", e);
      return false;
    }
  }
};
