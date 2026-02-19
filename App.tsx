
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import WishlistSidebar from './components/WishlistSidebar';
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

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mh_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mh_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mh_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('mh_lang');
    return (saved as Language) || 'en';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
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
    message: '🎉 Welcome to MobileHub! Static Mode Enabled', 
    isActive: true 
  });
  
  const [pendingAction, setPendingAction] = useState<'checkout' | null>(null);

  const t = TRANSLATIONS[language];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('mh_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mh_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mh_products', JSON.stringify(products));
  }, [products]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'gu' : 'en');
  };

  useEffect(() => {
    if (currentUser) localStorage.setItem('mh_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('mh_current_user');
  }, [currentUser]);

  useEffect(() => {
    if (location.pathname === '/adminjayu') {
      setIsAdminLoginOpen(true);
    }
  }, [location.pathname]);

  const showToast = (message: string) => { setToastMessage(message); setIsToastVisible(true); };

  const addToCart = (product: Product, silent = false) => {
    const isColorSelected = (product as any).selectedColor; 
    setCart(prev => {
      const colorToAdd = isColorSelected || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
      const existing = prev.find(item => item.id === product.id && item.selectedColor === colorToAdd);
      if (existing) {
          return prev.map(item => (item.id === product.id && item.selectedColor === colorToAdd) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedColor: colorToAdd }];
    });
    if (!silent) showToast(`${product.name} Added`);
  };

  const buyNow = (product: Product) => setSelectedProduct(product);

  const handleModalBuyNow = (product: Product) => {
      addToCart(product, true);
      if (currentUser) setIsCheckoutOpen(true);
      else { setIsAuthOpen(true); setPendingAction('checkout'); }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Logged out');
    navigate('/');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    if (pendingAction === 'checkout') { setIsCheckoutOpen(true); setPendingAction(null); }
  };

  const handlePlaceOrder = (details: { name: string; address: string; city: string }, discount: number, finalTotal: number, paymentMethod: 'COD' | 'UPI' = 'COD') => {
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
        paymentStatus: paymentMethod === 'UPI' ? 'Paid' : 'Pending'
    };
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    return newOrder;
  };

  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortBy === 'price_asc' ? a.price - b.price : sortBy === 'price_desc' ? b.price - a.price : b.rating - a.rating);

  const HomePage = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <HeroSection onShopNow={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })} language={language} />
      <FeaturesSection language={language} />
      <div className="grid grid-cols-3 gap-3 mb-8">
            <button onClick={() => setSelectedCategory(Category.CHARGER)} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${selectedCategory === Category.CHARGER ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800'}`}>
                <Zap size={24} /> <span className="text-xs font-bold">{t.categories[Category.CHARGER]}</span>
            </button>
            <button onClick={() => setSelectedCategory(Category.GLASS)} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${selectedCategory === Category.GLASS ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800'}`}>
                <Shield size={24} /> <span className="text-xs font-bold">{t.categories[Category.GLASS]}</span>
            </button>
            <button onClick={() => setSelectedCategory(Category.COVER)} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${selectedCategory === Category.COVER ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800'}`}>
                <Smartphone size={24} /> <span className="text-xs font-bold">{t.categories[Category.COVER]}</span>
            </button>
      </div>
      <div id="products-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} isWishlisted={wishlist.includes(product.id)} onAddToCart={addToCart} onBuyNow={buyNow} onViewDetails={setSelectedProduct} onToggleWishlist={(id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} language={language} />
        ))}
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] transition-colors pb-20 md:pb-0 text-gray-900 dark:text-gray-100">
      <AnnouncementBar message={announcement.message} isVisible={announcement.isActive} />
      <Navbar cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} wishlistItemCount={wishlist.length} currentUser={currentUser} onCartClick={() => setIsCartOpen(true)} onWishlistClick={() => setIsWishlistOpen(true)} searchTerm={searchTerm} onSearchChange={setSearchTerm} onOrdersClick={() => setIsOrderTrackerOpen(true)} onAuthClick={() => setIsAuthOpen(true)} onLogout={handleLogout} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} language={language} onToggleLanguage={toggleLanguage} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adminjayu" element={<HomePage />} />
        <Route path="/about" element={<LegalPage type="about" />} />
        <Route path="/privacy" element={<LegalPage type="privacy" />} />
        <Route path="/terms" element={<LegalPage type="terms" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={currentUser ? <UserProfile user={currentUser} onUpdateUser={setCurrentUser} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t z-50 md:hidden flex justify-around items-center h-16">
          <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-gray-400">
            <Home size={20} /> <span className="text-[8px] font-bold">HOME</span>
          </button>
          <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 relative">
            <ShoppingBag size={20} /> <span className="text-[8px] font-bold">CART</span>
          </button>
          <button onClick={() => setIsOrderTrackerOpen(true)} className="flex flex-col items-center gap-1 text-gray-400">
            <Package size={20} /> <span className="text-[8px] font-bold">ORDERS</span>
          </button>
      </div>
      <Footer />
      <UserAuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} onSignup={async(u) => { setUsers(prev => [...prev, u]); return true; }} users={users} />
      <AuthenticityVerifier isOpen={isVerifierOpen} onClose={() => setIsVerifierOpen(false)} language={language} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} savedItems={[]} onRemoveItem={(id) => setCart(prev => prev.filter(i => i.id !== id))} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity+d)} : i))} onCheckout={() => { setIsCartOpen(false); if (currentUser) setIsCheckoutOpen(true); else { setIsAuthOpen(true); setPendingAction('checkout'); } }} onSaveForLater={()=>{}} onMoveToCart={()=>{}} onRemoveSaved={()=>{}} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} items={products.filter(p => wishlist.includes(p.id))} onRemoveItem={(id) => setWishlist(prev => prev.filter(i => i !== id))} onAddToCart={addToCart} />
      <OrderTracker isOpen={isOrderTrackerOpen} onClose={() => setIsOrderTrackerOpen(false)} orders={orders} />
      <ProductModal isOpen={!!selectedProduct} product={selectedProduct} allProducts={products} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} onBuyNow={handleModalBuyNow} onAddReview={(pid, rev) => setProducts(prev => prev.map(p => p.id === pid ? {...p, reviews: [...p.reviews, rev]} : p))} language={language} currentUser={currentUser} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cart} coupons={coupons} onPlaceOrder={handlePlaceOrder} currentUser={currentUser} />
      <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => { setIsAdminLoginOpen(false); navigate('/'); }} onLogin={() => { setIsAdminDashboardOpen(true); setIsAdminLoginOpen(false); navigate('/'); }} />
      {isAdminDashboardOpen && (
        <AdminDashboard orders={orders} products={products} coupons={coupons} users={users} serverStatus="online" onUpdateOrderStatus={(id, st) => setOrders(prev => prev.map(o => o.id === id ? {...o, status: st} : o))} onAddProduct={(p) => setProducts(prev => [p, ...prev])} onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))} onUpdateStock={(id, s) => setProducts(prev => prev.map(p => p.id === id ? {...p, stock: s} : p))} onAddCoupon={(c) => setCoupons(prev => [...prev, c])} onDeleteCoupon={(code) => setCoupons(prev => prev.filter(c => c.code !== code))} onCheckConnection={()=>{}} onClose={() => setIsAdminDashboardOpen(false)} />
      )}
      <LiveSalesNotification />
      <WhatsAppButton />
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </div>
  );
};
export default App;
