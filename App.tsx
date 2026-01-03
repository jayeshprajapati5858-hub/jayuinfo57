
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import AIAssistant from './components/AIAssistant';
import ProductModal from './components/ProductModal';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import OrderTracker from './components/OrderTracker';
import Toast from './components/Toast';
import Footer from './components/Footer'; 
import HeroSection from './components/HeroSection';
import { SHOP_NAME, INITIAL_COUPONS, PRODUCTS } from './constants';
import { Product, CartItem, Category, Order, Coupon, Review } from './types';
import { Search, Filter, ArrowDownUp } from 'lucide-react';

// Firebase Imports
import { db } from './services/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

const App: React.FC = () => {
  // Data State (Managed by Firebase)
  // Initialize with PRODUCTS so the site isn't empty while connecting or if connection fails
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS); 

  // Sync Products from Firestore
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('category')); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      if (productsData.length > 0) {
        setProducts(productsData);
      } else {
        console.log("Database is empty, showing demo data or empty state.");
      }
    }, (error: any) => {
      console.error("Error fetching products:", error);
      if (error.code === 'permission-denied') {
        showToast("Firebase Console ma Firestore Database chalu karo (Start in Test Mode)");
      } else {
        showToast("Database connect nathi thayu. Demo data dekhay che.");
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Orders from Firestore
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    }, (error) => {
       console.error("Error fetching orders:", error);
    });
    return () => unsubscribe();
  }, []);

  // Sync Coupons from Firestore (Optional, but good for admin)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      if (!snapshot.empty) {
        const couponsData = snapshot.docs.map(doc => doc.data() as Coupon);
        setCoupons(prev => [...INITIAL_COUPONS, ...couponsData]);
      }
    }, (error) => {
       console.error("Error fetching coupons:", error);
    });
    return () => unsubscribe();
  }, []);

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  
  // Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast('Sorry, aa item stock ma nathi!');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      // Check stock limit
      const currentQty = existing ? existing.quantity : 0;
      if (currentQty + 1 > product.stock) {
        showToast(`Stock ma fakt ${product.stock} j items che!`);
        return prev;
      }

      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`${product.name} cart ma add thayu`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        // Check stock
        const product = products.find(p => p.id === id);
        if (product && newQty > product.stock) {
           showToast(`Fakt ${product.stock} items available che!`);
           return item;
        }
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  // --------------- FIREBASE ACTIONS ---------------- //

  const handlePlaceOrder = async (customerDetails: { name: string; address: string; city: string }, discount: number, finalTotal: number) => {
    try {
      const newOrder: Omit<Order, 'id'> = {
        customerName: customerDetails.name,
        address: `${customerDetails.address}, ${customerDetails.city}`,
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        discount,
        finalTotal,
        date: new Date().toISOString(),
        status: 'Pending'
      };

      // 1. Add Order to Firebase
      await addDoc(collection(db, 'orders'), newOrder);

      // 2. Update Stock in Firebase
      for (const item of cartItems) {
        // Only update stock if product exists in DB (not for demo products with numeric IDs '1', '2' etc unless seeded)
        if (item.id.length > 5) { 
           const productRef = doc(db, 'products', item.id);
           const currentProduct = products.find(p => p.id === item.id);
           if (currentProduct) {
             const newStock = Math.max(0, currentProduct.stock - item.quantity);
             await updateDoc(productRef, { stock: newStock });
           }
        }
      }

      setCartItems([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      showToast('Order safalta purvak place thai gayu che!');
    } catch (error) {
      console.error("Error placing order: ", error);
      showToast('Offline Mode: Order place thayu (Database Offline)');
      setCartItems([]);
      setIsCheckoutOpen(false);
    }
  };

  const handleAddReview = async (productId: string, review: Review) => {
    try {
      if (productId.length <= 5) {
         showToast("Demo products par review na apay");
         return;
      }
      const productRef = doc(db, 'products', productId);
      const product = products.find(p => p.id === productId);
      
      if (product) {
        const newReviews = [...product.reviews, review];
        const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        
        await updateDoc(productRef, {
          reviews: newReviews,
          rating: parseFloat(avgRating.toFixed(1))
        });
        showToast('Review added!');
      }
    } catch (error) {
      console.error("Error adding review: ", error);
      showToast('Database error');
    }
  };

  // Admin Functions interacting with Firebase
  const handleUpdateOrderStatus = async (orderId: string, status: 'Shipped' | 'Rejected') => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
      showToast(`Order status: ${status}`);
    } catch (error) {
      showToast('Failed to update order (Database Offline)');
    }
  };

  const handleAddProduct = async (product: Product) => {
    try {
      // Remove ID as Firestore generates it
      const { id, ...productData } = product; 
      await addDoc(collection(db, 'products'), productData);
      showToast('Product safalta purvak add thayu');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'permission-denied') {
        showToast('Error: Firebase Console ma Firestore Database chalu karo');
      } else {
        showToast('Product add na thayu');
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      if (productId.length <= 5) {
        showToast("Demo product delete na thay");
        return;
      }
      await deleteDoc(doc(db, 'products', productId));
      showToast('Product deleted');
    } catch (error) {
      showToast('Failed to delete product');
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      if (productId.length <= 5) return;
      await updateDoc(doc(db, 'products', productId), { stock: newStock });
    } catch (error) {
      showToast('Failed to update stock');
    }
  };

  const handleAddCoupon = async (coupon: Coupon) => {
    try {
      await addDoc(collection(db, 'coupons'), coupon);
      showToast('Coupon banavi didhu');
    } catch (error) {
       showToast('Coupon na banyu');
    }
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast('Coupon delete thayu');
  };

  // Filter & Sort Products
  const filteredProducts = products
    .filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        default: return 0; // Recommended/Default order
      }
    });

  const scrollToProducts = () => {
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      <Navbar 
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOrdersClick={() => setIsOrderTrackerOpen(true)}
        onAdminClick={() => setIsLoginOpen(true)}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        {selectedCategory === 'All' && !searchTerm && (
          <HeroSection onShopNow={scrollToProducts} />
        )}

        {/* Filters and Search Results */}
        <div id="product-grid" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm ? `Results for "${searchTerm}"` : selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Showing {filteredProducts.length} items
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <ArrowDownUp size={16} className="text-gray-500" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent outline-none text-sm font-medium text-gray-700 cursor-pointer appearance-none pr-4"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-gray-300 hidden md:block"></div>

            {/* Category Pills - Scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'All' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                All
              </button>
              {Object.values(Category).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              We couldn't find any items matching your criteria. Try different keywords or categories.
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="mt-6 text-primary font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <Footer />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <ProductModal 
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onAddReview={handleAddReview}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onPlaceOrder={handlePlaceOrder}
        coupons={coupons}
      />

      <AdminLoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={() => setIsAdminOpen(true)}
      />

      {isAdminOpen && (
        <AdminDashboard 
          orders={orders}
          products={products}
          coupons={coupons}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateStock={handleUpdateStock}
          onAddCoupon={handleAddCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      <OrderTracker 
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={orders}
      />

      <AIAssistant />

      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
};

export default App;
