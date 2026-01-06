
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
import FlashSale from './components/FlashSale';
import LiveSalesNotification from './components/LiveSalesNotification';
import WhatsAppButton from './components/WhatsAppButton';
import SkeletonProduct from './components/SkeletonProduct';
import WarrantyPortal from './components/WarrantyPortal';
import AuthenticityVerifier from './components/AuthenticityVerifier';
import { INITIAL_COUPONS, PRODUCTS as DEFAULT_PRODUCTS, TRANSLATIONS } from './constants';
import { Product, CartItem, Category, Order, Coupon, Review, Language, ProtectionPlan } from './types';
import { Home, Search, ShoppingBag, Package, Smartphone, ShieldCheck } from 'lucide-react';
import { api } from './services/api';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [language, setLanguage] = useState<Language>('gu'); 
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const t = TRANSLATIONS[language];

  // Robust Admin URL Detection (Case-Insensitive)
  useEffect(() => {
    const checkSecretPath = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      if (
        path.endsWith('/adminjayu') || 
        hash === '#adminjayu' || 
        search.includes('adminjayu')
      ) {
        setIsAdminLoginOpen(true);
      }
    };
    
    checkSecretPath();
    window.addEventListener('hashchange', checkSecretPath);
    window.addEventListener('popstate', checkSecretPath);
    return () => {
      window.removeEventListener('hashchange', checkSecretPath);
      window.removeEventListener('popstate', checkSecretPath);
    };
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const loadData = async () => {
    try {
      const dbProducts = await api.getProducts();
      if (dbProducts?.length > 0) setProducts(dbProducts);
      const dbOrders = await api.getOrders();
      setOrders(dbOrders || []);
    } catch (e) {
      console.warn("API Load failed.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const addToCart = (product: Product, plan?: ProtectionPlan) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1, protectionPlan: plan || item.protectionPlan } : item);
      return [...prev, { ...product, quantity: 1, protectionPlan: plan }];
    });
    showToast(`${product.name} Added`);
  };

  const showToast = (message: string) => { setToastMessage(message); setIsToastVisible(true); };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortBy === 'price_asc' ? a.price - b.price : sortBy === 'price_desc' ? b.price - a.price : b.rating - a.rating);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pb-20 md:pb-0">
      <Navbar 
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        wishlistItemCount={wishlist.length} 
        onCartClick={() => setIsCartOpen(true)} 
        onWishlistClick={() => setIsWishlistOpen(true)} 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onOrdersClick={() => setIsOrderTrackerOpen(true)} 
        onAdminClick={() => setIsAdminLoginOpen(true)} 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HeroSection onShopNow={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })} />
        
        <FlashSale />

        {/* Section Title Only - Category/Model Selector Removed */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">{t.premium_collection}</h2>
          </div>
        </div>

        <div id="products-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {isLoading ? Array(6).fill(0).map((_, i) => <SkeletonProduct key={i} />) : filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isWishlisted={wishlist.includes(product.id)} 
              onAddToCart={(p) => addToCart(p)} 
              onViewDetails={setSelectedProduct} 
              onToggleWishlist={(id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} 
            />
          ))}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 md:hidden flex justify-around items-center h-16 px-4">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
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

      <AuthenticityVerifier isOpen={isVerifierOpen} onClose={() => setIsVerifierOpen(false)} language={language} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} savedItems={[]} onRemoveItem={(id) => setCart(prev => prev.filter(i => i.id !== id))} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity+d)} : i))} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} onSaveForLater={()=>{}} onMoveToCart={()=>{}} onRemoveSaved={()=>{}} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} items={products.filter(p => wishlist.includes(p.id))} onRemoveItem={(id) => setWishlist(prev => prev.filter(i => i !== id))} onAddToCart={addToCart} />
      <OrderTracker isOpen={isOrderTrackerOpen} onClose={() => setIsOrderTrackerOpen(false)} orders={orders} />
      <ProductModal isOpen={!!selectedProduct} product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} onAddReview={()=>{}} language={language} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cart} coupons={coupons} onPlaceOrder={(det, disc, tot) => {
        const order: Order = { 
            id: `ord-${Date.now()}`, 
            customerName: det.name, 
            address: det.address, 
            items: [...cart], 
            total: tot+disc, 
            discount: disc, 
            finalTotal: tot, 
            date: new Date().toISOString(), 
            status: 'Pending',
            verificationCode: 'MH' + Math.floor(Math.random() * 900000 + 100000)
        };
        setOrders(prev => [...prev, order]);
        setCart([]);
        return order;
      }} />
      <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} onLogin={() => setIsAdminDashboardOpen(true)} />
      {isAdminDashboardOpen && <AdminDashboard orders={orders} products={products} coupons={coupons} onUpdateOrderStatus={(id, s) => setOrders(prev => prev.map(o => o.id === id ? {...o, status: s} : o))} onAddProduct={(p) => setProducts(prev => [p, ...prev])} onDeleteProduct={(id) => setProducts(prev => prev.filter(i => i.id !== id))} onUpdateStock={(id, s) => setProducts(prev => prev.map(i => i.id === id ? {...i, stock: s} : i))} onAddCoupon={(c) => setCoupons(prev => [...prev, c])} onDeleteCoupon={(c) => setCoupons(prev => prev.filter(cp => cp.code !== c))} onClose={() => setIsAdminDashboardOpen(false)} />}
      <AIAssistant />
      <LiveSalesNotification />
      <WhatsAppButton />
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </div>
  );
};

export default App;
