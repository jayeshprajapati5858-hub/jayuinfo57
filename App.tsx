
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import WishlistSidebar from './components/WishlistSidebar';
import AIAssistant from './components/AIAssistant';
import ProductModal from './components/ProductModal';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import UserAuthModal from './components/UserAuthModal';
import OrderTracker from './components/OrderTracker';
import Toast from './components/Toast';
import Footer from './components/Footer'; 
import HeroSection from './components/HeroSection';
import LiveSalesNotification from './components/LiveSalesNotification';
import WhatsAppButton from './components/WhatsAppButton';
import SkeletonProduct from './components/SkeletonProduct';
import AuthenticityVerifier from './components/AuthenticityVerifier';
import LegalPage from './components/LegalPage';
import ContactPage from './components/ContactPage';
import AnnouncementBar from './components/AnnouncementBar';
import FeaturesSection from './components/FeaturesSection';
import UserProfile from './components/UserProfile';
import { INITIAL_COUPONS, PRODUCTS as DEFAULT_PRODUCTS, TRANSLATIONS } from './constants';
import { Product, CartItem, Category, Order, Coupon, Review, User, Announcement, Language } from './types';
import { Package, Zap, Shield, Smartphone, Home, ShoppingBag } from 'lucide-react';
import { api } from './services/api';
import { signOut } from 'firebase/auth';
import { auth } from './services/firebase';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mh_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('mh_lang');
    return (saved as Language) || 'en';
  });

  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [sortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  
  const [announcement, setAnnouncement] = useState<Announcement>({ 
    message: '🎉 Welcome to MobileHub! Get 50% OFF on First Order', 
    isActive: true 
  });
  
  const [pendingAction, setPendingAction] = useState<'checkout' | null>(null);

  const t = TRANSLATIONS[language];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('mh_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'gu' : 'en');
  };

  useEffect(() => {
    if (currentUser) localStorage.setItem('mh_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('mh_current_user');
  }, [currentUser]);

  useEffect(() => {
    const checkSecretPath = () => {
      const path = location.pathname.toLowerCase();
      // Check if path contains adminjayu (handling both /adminjayu and /#/adminjayu logic via router)
      if (path.includes('adminjayu')) {
        setIsAdminLoginOpen(true);
      }
    };
    checkSecretPath();
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const showToast = (message: string) => { setToastMessage(message); setIsToastVisible(true); };

  const loadData = async () => {
    setServerStatus('checking');
    try {
      const dbProducts = await api.getProducts();
      if (!dbProducts || dbProducts.length === 0) {
        console.log("Database empty. Seeding with default data...");
        await api.seedProducts(DEFAULT_PRODUCTS);
        setProducts(DEFAULT_PRODUCTS);
        showToast("Database Connected & Initialized");
      } else {
        setProducts(dbProducts);
      }
      
      const dbOrders = await api.getOrders();
      if (dbOrders) setOrders(dbOrders);

      const dbUsers = await api.getUsers();
      if (dbUsers) setUsers(dbUsers);

      const dbCoupons = await api.getCoupons();
      if (dbCoupons && dbCoupons.length > 0) setCoupons(dbCoupons);
      
      const dbAnnouncement = await api.getAnnouncement();
      if (dbAnnouncement && dbAnnouncement.message) {
         setAnnouncement(dbAnnouncement);
      } else {
        const defaultAnnouncement = { 
          message: '🎉 Welcome to MobileHub! Sale is Live!', 
          isActive: true 
        };
        await api.updateAnnouncement(defaultAnnouncement);
        setAnnouncement(defaultAnnouncement);
      }

      const isHealthy = await api.checkHealth();
      setServerStatus(isHealthy ? 'online' : 'offline');

    } catch (e) {
      console.error("Load failed", e);
      setProducts(DEFAULT_PRODUCTS);
      setServerStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const addToCart = (product: Product, silent = false) => {
    const hasColorOptions = product.colors && product.colors.length > 0;
    const isColorSelected = (product as any).selectedColor; 

    if (hasColorOptions && !isColorSelected) {
      setSelectedProduct(product); 
      return;
    }

    setCart(prev => {
      const colorToAdd = isColorSelected || (hasColorOptions ? product.colors[0] : undefined);
      const existing = prev.find(item => item.id === product.id && item.selectedColor === colorToAdd);
      
      if (existing) {
          return prev.map(item => (item.id === product.id && item.selectedColor === colorToAdd) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedColor: colorToAdd }];
    });
    if (!silent) showToast(`${product.name} Added`);
  };

  const buyNow = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleModalBuyNow = (product: Product) => {
      setCart(prev => {
        const colorToAdd = (product as any).selectedColor;
        const existing = prev.find(item => item.id === product.id && item.selectedColor === colorToAdd);
        if (existing) {
            return prev.map(item => (item.id === product.id && item.selectedColor === colorToAdd) ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1, selectedColor: colorToAdd }];
      });
      
      if (currentUser) {
        setIsCheckoutOpen(true);
      } else {
        setIsAuthOpen(true);
        setPendingAction('checkout');
      }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      showToast('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
      setCurrentUser(null);
    }
  };

  const handleSignup = async (newUser: User) => {
    try {
      const savedUser = await api.createUser(newUser);
      if (savedUser) {
        setUsers(prev => [...prev, savedUser]);
        showToast('Account created!');
        return true;
      }
      return false;
    } catch (e: any) {
      showToast('Error creating account');
      return false;
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    if (pendingAction === 'checkout') {
      setIsCheckoutOpen(true);
      setPendingAction(null);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddProduct = async (product: Product) => {
    showToast('Uploading product...');
    const savedProduct = await api.addProduct(product);
    if (savedProduct) {
      setProducts(prev => [savedProduct, ...prev]);
      showToast('Product added successfully!');
    } else {
      showToast('Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const success = await api.deleteProduct(productId);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Product deleted');
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    const success = await api.updateStock(productId, newStock);
    if (success) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'Shipped' | 'Rejected') => {
    const success = await api.updateOrderStatus(orderId, status);
    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      showToast(`Order marked as ${status}`);
    }
  };

  const handleAddCoupon = async (coupon: Coupon) => {
    const success = await api.addCoupon(coupon);
    if (success) {
      setCoupons(prev => [...prev, coupon]);
      showToast('Coupon added');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    const success = await api.deleteCoupon(code);
    if (success) {
      setCoupons(prev => prev.filter(c => c.code !== code));
      showToast('Coupon deleted');
    }
  };

  const handleAddReview = async (productId: string, review: Review) => {
    const success = await api.addReview(productId, review);
    if (success) {
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
           const newReviews = [...p.reviews, review];
           const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
           const newRating = Number((totalRating / newReviews.length).toFixed(1));
           return { ...p, reviews: newReviews, rating: newRating };
        }
        return p;
      }));
      showToast('Review submitted successfully!');
    } else {
      showToast('Failed to add review');
    }
  };

  const handlePlaceOrder = (details: { name: string; address: string; city: string }, discount: number, finalTotal: number, paymentMethod: 'COD' | 'UPI' = 'COD', paymentScreenshot?: string) => {
    const newOrder: Order = { 
        id: `ord-${Date.now()}`, 
        customerName: details.name, 
        address: details.address, 
        items: [...cart], 
        total: finalTotal + discount, 
        discount: discount, 
        finalTotal: finalTotal, 
        date: new Date().toISOString(), 
        status: 'Pending',
        verificationCode: 'MH' + Math.floor(Math.random() * 900000 + 100000),
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'UPI' ? 'Paid' : 'Pending',
        paymentScreenshot: paymentScreenshot
    };

    api.createOrder(newOrder).then((saved) => {
      if (saved) {
        setOrders(prev => [...prev, saved]);
        newOrder.items.forEach(item => {
           handleUpdateStock(item.id, Math.max(0, item.stock - item.quantity));
        });
      }
    });

    setCart([]);
    return newOrder;
  };

  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortBy === 'price_asc' ? a.price - b.price : sortBy === 'price_desc' ? b.price - a.price : b.rating - a.rating);

  const HomePage = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <HeroSection 
        onShopNow={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })} 
        language={language}
      />
      <FeaturesSection language={language} />
      <div className="grid grid-cols-3 gap-3 mb-8 animate-fadeInUp stagger-1">
            <button onClick={() => setSelectedCategory(Category.CHARGER)} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${selectedCategory === Category.CHARGER ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary/50'}`}>
                <Zap size={24} className={selectedCategory === Category.CHARGER ? 'text-yellow-300 fill-yellow-300' : 'text-primary'} />
                <span className="font-bold text-xs uppercase tracking-wide">{t.categories[Category.CHARGER]}</span>
            </button>
            <button onClick={() => setSelectedCategory(Category.GLASS)} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${selectedCategory === Category.GLASS ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary/50'}`}>
                <Shield size={24} className={selectedCategory === Category.GLASS ? 'text-white' : 'text-blue-500'} />
                <span className="font-bold text-xs uppercase tracking-wide">{t.categories[Category.GLASS]}</span>
            </button>
            <button onClick={() => setSelectedCategory(Category.COVER)} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${selectedCategory === Category.COVER ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary/50'}`}>
                <Smartphone size={24} className={selectedCategory === Category.COVER ? 'text-white' : 'text-purple-500'} />
                <span className="font-bold text-xs uppercase tracking-wide">{t.categories[Category.COVER]}</span>
            </button>
      </div>
      <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">{t.premium_collection}</h2>
          {selectedCategory !== 'All' && (
              <button onClick={() => setSelectedCategory('All')} className="text-xs font-bold text-primary hover:underline">
                  View All
              </button>
          )}
      </div>
      <div id="products-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {isLoading ? Array(6).fill(0).map((_, i) => <SkeletonProduct key={i} />) : filteredProducts.length > 0 ? filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isWishlisted={wishlist.includes(product.id)} 
            onAddToCart={(p) => addToCart(p)} 
            onBuyNow={(p) => buyNow(p)}
            onViewDetails={setSelectedProduct} 
            onToggleWishlist={(id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} 
            language={language}
          />
        )) : (
          <div className="col-span-full py-12 text-center text-gray-400 flex flex-col items-center">
              <Package size={48} className="mb-4 opacity-20" />
              <p>No products found in this category.</p>
              <button onClick={() => setSelectedCategory('All')} className="mt-4 text-primary font-bold">View All Products</button>
          </div>
        )}
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] transition-colors duration-300 pb-20 md:pb-0 text-gray-900 dark:text-gray-100">
      <AnnouncementBar message={announcement.message} isVisible={announcement.isActive} />
      <Navbar 
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        wishlistItemCount={wishlist.length} 
        currentUser={currentUser}
        onCartClick={() => setIsCartOpen(true)} 
        onWishlistClick={() => setIsWishlistOpen(true)} 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onOrdersClick={() => setIsOrderTrackerOpen(true)} 
        onAdminClick={() => setIsAdminLoginOpen(true)} 
        onAuthClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        language={language}
        onToggleLanguage={toggleLanguage}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* ADDED: Explicit route for adminjayu so it renders HomePage under the modal instead of 404/redirect */}
        <Route path="/adminjayu" element={<HomePage />} />
        <Route path="/about" element={<LegalPage type="about" />} />
        <Route path="/privacy" element={<LegalPage type="privacy" />} />
        <Route path="/terms" element={<LegalPage type="terms" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={currentUser ? <UserProfile user={currentUser} onUpdateUser={handleUpdateUser} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 md:hidden flex justify-around items-center h-16 px-4">
          <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
            <Home size={20} />
            <span className="text-[8px] font-bold uppercase">Home</span>
          </button>
          <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors relative">
            <ShoppingBag size={20} />
            <span className="text-[8px] font-bold uppercase">Cart</span>
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{cart.length}</span>}
          </button>
          <button onClick={() => setIsOrderTrackerOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
            <Package size={20} />
            <span className="text-[8px] font-bold uppercase">Orders</span>
          </button>
          <button onClick={() => setIsWishlistOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
            <Package size={20} className="rotate-180" />
            <span className="text-[8px] font-bold uppercase">Wishlist</span>
          </button>
      </div>
      <Footer />
      <UserAuthModal 
        isOpen={isAuthOpen} 
        onClose={() => { setIsAuthOpen(false); setPendingAction(null); }} 
        onLogin={handleLogin}
        onSignup={handleSignup}
        users={users} 
        onResetPassword={async () => true} 
      />
      <AuthenticityVerifier isOpen={isVerifierOpen} onClose={() => setIsVerifierOpen(false)} language={language} />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        savedItems={[]} 
        onRemoveItem={(id) => setCart(prev => prev.filter(i => i.id !== id))} 
        onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity+d)} : i))} 
        onCheckout={() => { 
          setIsCartOpen(false); 
          if (currentUser) {
            setIsCheckoutOpen(true); 
          } else {
            setIsAuthOpen(true);
            setPendingAction('checkout');
          }
        }} 
        onSaveForLater={()=>{}} 
        onMoveToCart={()=>{}} 
        onRemoveSaved={()=>{}} 
      />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} items={products.filter(p => wishlist.includes(p.id))} onRemoveItem={(id) => setWishlist(prev => prev.filter(i => i !== id))} onAddToCart={addToCart} />
      <OrderTracker isOpen={isOrderTrackerOpen} onClose={() => setIsOrderTrackerOpen(false)} orders={orders} />
      <ProductModal 
        isOpen={!!selectedProduct} 
        product={selectedProduct} 
        allProducts={products}
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={addToCart} 
        onBuyNow={handleModalBuyNow}
        onAddReview={handleAddReview} 
        language={language} 
        currentUser={currentUser}
      />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cartItems={cart} 
        coupons={coupons} 
        onPlaceOrder={handlePlaceOrder} 
        currentUser={currentUser}
      />
      <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} onLogin={() => setIsAdminDashboardOpen(true)} />
      {isAdminDashboardOpen && (
        <AdminDashboard 
          orders={orders} 
          products={products} 
          coupons={coupons} 
          users={users}
          serverStatus={serverStatus}
          onUpdateOrderStatus={handleUpdateOrderStatus} 
          onAddProduct={handleAddProduct} 
          onDeleteProduct={handleDeleteProduct} 
          onUpdateStock={handleUpdateStock} 
          onAddCoupon={handleAddCoupon} 
          onDeleteCoupon={handleDeleteCoupon} 
          onAddReview={handleAddReview}
          onClose={() => setIsAdminDashboardOpen(false)} 
        />
      )}
      <AIAssistant />
      <LiveSalesNotification />
      <WhatsAppButton />
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </div>
  );
};
export default App;
