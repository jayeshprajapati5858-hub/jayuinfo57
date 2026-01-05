
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import WishlistSidebar from './components/WishlistSidebar';
import AIAssistant from './components/AIAssistant';
import ProductModal from './components/ProductModal';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import OrderTracker from './components/OrderTracker';
import Toast from './components/Toast';
import Footer from './components/Footer'; 
import HeroSection from './components/HeroSection';
import LiveSalesNotification from './components/LiveSalesNotification';
import WhatsAppButton from './components/WhatsAppButton';
import SkeletonProduct from './components/SkeletonProduct';
import WarrantyPortal from './components/WarrantyPortal';
import { INITIAL_COUPONS, PRODUCTS as DEFAULT_PRODUCTS } from './constants';
import { Product, CartItem, Category, Order, Coupon, Review } from './types';
import { ArrowDownUp, Sparkles, RefreshCcw, Coins, ShieldCheck } from 'lucide-react';
import { api } from './services/api';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [userCoins, setUserCoins] = useState<number>(0);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // System State
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isWarrantyPortalOpen, setIsWarrantyPortalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Filtering & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');

  // Notifications
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // --- DARK MODE SYNC ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // --- INITIAL DATA LOADING ---
  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    
    try {
      const isConnected = await api.checkHealth();
      
      if (isConnected) {
        setIsOnlineMode(true);
        try {
          const [dbProducts, dbOrders] = await Promise.all([
            api.getProducts(),
            api.getOrders()
          ]);
          
          if (dbProducts && dbProducts.length > 0) {
             setProducts(dbProducts);
          } else {
             setProducts(DEFAULT_PRODUCTS);
          }
          setOrders(dbOrders || []);
        } catch (fetchErr) {
          throw new Error("Data fetch error");
        }
      } else {
        throw new Error("Backend not reachable");
      }
    } catch (error) {
      setIsOnlineMode(false);
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(DEFAULT_PRODUCTS);
        localStorage.setItem('products', JSON.stringify(DEFAULT_PRODUCTS));
      }
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } finally {
      // Small artificial delay to show off skeletons nicely
      setTimeout(() => setIsLoading(false), 800);
    }

    const savedCoupons = localStorage.getItem('coupons');
    if (savedCoupons) setCoupons(JSON.parse(savedCoupons));

    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const savedSaved = localStorage.getItem('savedForLater');
    if (savedSaved) setSavedForLater(JSON.parse(savedSaved));

    const savedCoins = localStorage.getItem('userCoins');
    if (savedCoins) setUserCoins(Number(savedCoins));
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    localStorage.setItem('coupons', JSON.stringify(coupons));
    localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
    localStorage.setItem('userCoins', userCoins.toString());
    
    if (!isOnlineMode) {
      localStorage.setItem('products', JSON.stringify(products));
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [products, orders, coupons, cart, wishlist, savedForLater, userCoins, isOnlineMode]);

  // --- ACTIONS ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  const handleSaveForLater = (item: CartItem) => {
    setCart(prev => prev.filter(i => i.id !== item.id));
    setSavedForLater(prev => {
        if (prev.find(i => i.id === item.id)) return prev;
        return [...prev, item];
    });
    showToast('Saved for later!');
  };

  const handleMoveToCart = (product: Product) => {
    setSavedForLater(prev => prev.filter(i => i.id !== product.id));
    addToCart(product);
  };

  const handlePlaceOrder = async (customerDetails: { name: string, address: string, city: string }, discount: number, finalTotal: number) => {
    const earned = Math.floor(finalTotal * 0.05);
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName: customerDetails.name,
      address: `${customerDetails.address}, ${customerDetails.city}`,
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      discount,
      finalTotal,
      date: new Date().toISOString(),
      status: 'Pending',
      coinsEarned: earned
    };

    setOrders(prev => [...prev, newOrder]);
    setUserCoins(prev => prev + earned);
    
    if (isOnlineMode) {
      try {
        await api.createOrder(newOrder);
        for (const item of cart) {
             const product = products.find(p => p.id === item.id);
             if (product) {
                 await api.updateStock(item.id, Math.max(0, product.stock - item.quantity));
             }
        }
        loadData(true);
      } catch (e) { showToast('Sync error, saved locally.'); }
    } else {
       setProducts(prev => prev.map(p => {
            const cartItem = cart.find(c => c.id === p.id);
            return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity), sales: (p.sales || 0) + cartItem.quantity } : p;
       }));
    }

    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    showToast(`Order success! Earned ${earned} coins.`);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      showToast(exists ? 'Removed from Wishlist' : 'Added to Wishlist');
      return exists ? prev.filter(id => id !== productId) : [...prev, productId];
    });
  };

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast(`Only ${product.stock} available!`);
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added!`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const maxStock = product ? product.stock : 100;
        const newQty = Math.max(1, Math.min(item.quantity + delta, maxStock));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));

  // --- ADMIN & DATA HANDLERS ---

  // Fix: Added handleUpdateOrderStatus
  const handleUpdateOrderStatus = async (orderId: string, status: 'Shipped' | 'Rejected') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (isOnlineMode) {
      try {
        await api.updateOrderStatus(orderId, status);
      } catch (e) {
        showToast('Sync error, updated locally.');
      }
    }
    showToast(`Order marked as ${status}`);
  };

  // Fix: Added handleAddProduct
  const handleAddProduct = async (product: Product) => {
    setProducts(prev => [product, ...prev]);
    if (isOnlineMode) {
      try {
        await api.addProduct(product);
      } catch (e) {
        showToast('Sync error, added locally.');
      }
    }
    showToast(`${product.name} added to inventory`);
  };

  // Fix: Added handleDeleteProduct
  const handleDeleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (isOnlineMode) {
      try {
        await api.deleteProduct(productId);
      } catch (e) {
        showToast('Sync error, removed locally.');
      }
    }
    showToast('Product removed');
  };

  // Fix: Added handleUpdateStock
  const handleUpdateStock = async (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    if (isOnlineMode) {
      try {
        await api.updateStock(productId, newStock);
      } catch (e) {
        showToast('Sync error, updated locally.');
      }
    }
  };

  // Fix: Added handleAddCoupon
  const handleAddCoupon = (coupon: Coupon) => {
    setCoupons(prev => [...prev, coupon]);
    showToast(`Coupon ${coupon.code} added`);
  };

  // Fix: Added handleDeleteCoupon
  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast('Coupon removed');
  };

  // Fix: Added handleAddReview
  const handleAddReview = async (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReviews = [...p.reviews, review];
        const newRating = Number((newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length).toFixed(1));
        return { ...p, reviews: newReviews, rating: newRating };
      }
      return p;
    }));

    if (isOnlineMode) {
      try {
        await api.addReview(productId, review);
      } catch (e) {
        showToast('Sync error, review added locally.');
      }
    }
    showToast('Review added!');
  };

  // --- FILTERING ---
  const filteredProducts = products
    .filter(p => (selectedCategory === 'All' || p.category === selectedCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return b.rating - a.rating;
    });

  const categories = ['All', ...Object.values(Category)];

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar 
        cartItemCount={cart.length}
        wishlistItemCount={wishlist.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOrdersClick={() => setIsOrderTrackerOpen(true)}
        onAdminClick={() => setIsAdminLoginOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Floating Loyalty Indicator */}
      <div className="fixed top-20 right-4 z-40 hidden lg:flex items-center gap-2 bg-white dark:bg-gray-800 p-2 pl-4 rounded-full border border-gray-100 dark:border-gray-700 shadow-xl group cursor-help overflow-hidden">
          <div className="text-right">
              <p className="text-[10px] text-gray-500 leading-none">Your Balance</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{userCoins}</p>
          </div>
          <div className="p-2 bg-accent/20 text-accent rounded-full animate-pulse group-hover:animate-bounce">
              <Coins size={20} />
          </div>
          <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        <HeroSection onShopNow={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} />

        {/* Brand Perks Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 mx-2">
            <button onClick={() => setIsWarrantyPortalOpen(true)} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                <div className="p-2 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform"><ShieldCheck size={20} /></div>
                <div className="text-left"><p className="text-xs font-bold text-gray-900 dark:text-white">Register Warranty</p><p className="text-[10px] text-gray-500">1 Year Protection</p></div>
            </button>
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="p-2 bg-accent/10 text-accent rounded-xl"><Coins size={20} /></div>
                <div className="text-left"><p className="text-xs font-bold text-gray-900 dark:text-white">Earn Rewards</p><p className="text-[10px] text-gray-500">5% Cashback Points</p></div>
            </div>
            <div className="hidden md:flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="p-2 bg-green-100 text-green-600 rounded-xl"><RefreshCcw size={20} /></div>
                <div className="text-left"><p className="text-xs font-bold text-gray-900 dark:text-white">Easy Returns</p><p className="text-[10px] text-gray-500">7-Day Exchange</p></div>
            </div>
            <div className="hidden md:flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Sparkles size={20} /></div>
                <div className="text-left"><p className="text-xs font-bold text-gray-900 dark:text-white">Premium Quality</p><p className="text-[10px] text-gray-500">Verified Products</p></div>
            </div>
        </div>

        <div id="shop" className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-primary" size={20} /> Best Sellers
            </h2>
             <div className="relative w-full md:w-auto">
               <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full md:w-auto pl-4 pr-10 py-2.5 bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer shadow-sm">
                 <option value="rating">Top Rated</option>
                 <option value="price_asc">Price: Low to High</option>
                 <option value="price_desc">Price: High to Low</option>
               </select>
               <ArrowDownUp size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="sticky top-16 z-30 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm py-2 mb-6 -mx-2 px-2 sm:mx-0 sm:px-0">
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide no-scrollbar touch-pan-x">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat as any)} className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform ${selectedCategory === cat ? 'bg-gray-900 dark:bg-primary text-white shadow-lg scale-105' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}>
                  {cat === 'All' ? 'Discover All' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid / Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            [...Array(8)].map((_, i) => <SkeletonProduct key={i} />)
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} isWishlisted={wishlist.includes(product.id)} onAddToCart={addToCart} onViewDetails={setSelectedProduct} onToggleWishlist={toggleWishlist} />
            ))
          )}
        </div>
      </main>

      <Footer />
      
      <CartSidebar 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} 
        savedItems={savedForLater} onRemoveItem={removeFromCart} onUpdateQuantity={updateCartQuantity} onCheckout={() => setIsCheckoutOpen(true)}
        onSaveForLater={handleSaveForLater} onMoveToCart={handleMoveToCart} onRemoveSaved={(id) => setSavedForLater(prev => prev.filter(i => i.id !== id))}
      />

      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} items={products.filter(p => wishlist.includes(p.id))} onRemoveItem={toggleWishlist} onAddToCart={addToCart} />
      <ProductModal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} product={selectedProduct} onAddToCart={addToCart} onAddReview={handleAddReview} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cart} onPlaceOrder={handlePlaceOrder} coupons={coupons} />
      <OrderTracker isOpen={isOrderTrackerOpen} onClose={() => setIsOrderTrackerOpen(false)} orders={orders} />
      <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} onLogin={() => setIsAdminDashboardOpen(true)} />
      <WarrantyPortal isOpen={isWarrantyPortalOpen} onClose={() => setIsWarrantyPortalOpen(false)} />

      {isAdminDashboardOpen && (
        <AdminDashboard orders={orders} products={products} coupons={coupons} onUpdateOrderStatus={handleUpdateOrderStatus} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} onUpdateStock={handleUpdateStock} onAddCoupon={handleAddCoupon} onDeleteCoupon={handleDeleteCoupon} onAddReview={handleAddReview} onClose={() => setIsAdminDashboardOpen(false)} />
      )}

      <AIAssistant />
      <WhatsAppButton />
      <LiveSalesNotification />
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </div>
  );
};

export default App;
