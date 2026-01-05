
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
import StyleMatcher from './components/StyleMatcher';
import AuthenticityVerifier from './components/AuthenticityVerifier';
import { INITIAL_COUPONS, PRODUCTS as DEFAULT_PRODUCTS, TRANSLATIONS } from './constants';
import { Product, CartItem, Category, Order, Coupon, Review, Language, ProtectionPlan } from './types';
import { ArrowDownUp, Sparkles, RefreshCcw, Coins, ShieldCheck, Mail, Send, ArrowRight, Star, QrCode } from 'lucide-react';
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
  const [language, setLanguage] = useState<Language>('gu'); // Default to Gujarati
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isWarrantyPortalOpen, setIsWarrantyPortalOpen] = useState(false);
  const [isStyleMatcherOpen, setIsStyleMatcherOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const dbProducts = await api.getProducts();
      setProducts(dbProducts.length > 0 ? dbProducts : DEFAULT_PRODUCTS);
      const dbOrders = await api.getOrders();
      setOrders(dbOrders || []);
    } catch (e) {
      setProducts(DEFAULT_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- ADMIN HANDLERS ---
  const handleUpdateOrderStatus = async (orderId: string, status: 'Shipped' | 'Rejected') => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      showToast(`Order #${orderId.slice(-6)} ${status}`);
    } catch (e) {
      showToast("Error updating order");
    }
  };

  const handleAddProduct = async (product: Product) => {
    try {
      const added = await api.addProduct(product);
      setProducts(prev => [added, ...prev]);
      showToast("Product added successfully");
    } catch (e) {
      // Fallback for local testing if API fails
      setProducts(prev => [product, ...prev]);
      showToast("Product added (Local)");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Product deleted");
    } catch (e) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateStock = async (id: string, stock: number) => {
    try {
      await api.updateStock(id, stock);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock } : p));
    } catch (e) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock } : p));
    }
  };

  const handleAddReview = async (productId: string, review: Review) => {
    try {
      await api.addReview(productId, review);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: [review, ...p.reviews] } : p));
      showToast("Review added");
    } catch (e) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: [review, ...p.reviews] } : p));
    }
  };

  const handleAddCoupon = (coupon: Coupon) => {
    setCoupons(prev => [...prev, coupon]);
    showToast("Coupon added");
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast("Coupon removed");
  };

  // --- SHOP HANDLERS ---
  const addToCart = (product: Product, plan?: ProtectionPlan) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1, protectionPlan: plan || item.protectionPlan } : item);
      return [...prev, { ...product, quantity: 1, protectionPlan: plan }];
    });
    showToast(`${product.name} Added`);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id: string, delta: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const toggleWishlist = (productId: string) => setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  const showToast = (message: string) => { setToastMessage(message); setIsToastVisible(true); };

  const handlePlaceOrder = (customerDetails: { name: string; address: string; city: string }, discount: number, finalTotal: number): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      customerName: customerDetails.name,
      address: `${customerDetails.address}, ${customerDetails.city}`,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + ((item.price + (item.protectionPlan?.price || 0)) * item.quantity), 0),
      discount: discount,
      finalTotal: finalTotal,
      date: new Date().toISOString(),
      status: 'Pending'
    };
    
    // Attempt to save to API
    api.createOrder(newOrder).catch(() => console.warn("API Create Order failed, saved locally."));
    
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    return newOrder;
  };

  const filteredProducts = products
    .filter(p => (p.name.toLowerCase().includes(searchTerm.toLowerCase())) && (selectedCategory === 'All' || p.category === selectedCategory))
    .sort((a, b) => sortBy === 'price_asc' ? a.price - b.price : sortBy === 'price_desc' ? b.price - a.price : b.rating - a.rating);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection onShopNow={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })} />
        
        {/* Next-Gen Feature Entry Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div 
              onClick={() => setIsStyleMatcherOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 rounded-[40px] text-white cursor-pointer hover:scale-[1.02] transition-all shadow-xl group overflow-hidden relative"
            >
               <Sparkles className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-150 transition-transform duration-1000" size={200} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 flex items-center gap-2">
                 <Sparkles className="text-yellow-300" /> {t.style_matcher}
               </h3>
               <p className="text-sm opacity-80 max-w-xs">{t.upload_outfit}</p>
            </div>
            <div 
              onClick={() => setIsVerifierOpen(true)}
              className="bg-gray-900 dark:bg-gray-800 p-8 rounded-[40px] text-white cursor-pointer hover:scale-[1.02] transition-all shadow-xl group overflow-hidden relative"
            >
               <QrCode className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-700" size={200} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 flex items-center gap-2">
                 <ShieldCheck className="text-green-400" /> {t.verify_product}
               </h3>
               <p className="text-sm opacity-80 max-w-xs">Verify your genuine gear instantly.</p>
            </div>
        </div>

        <FlashSale />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2 italic uppercase tracking-tighter">{t.premium_collection}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                {['All', ...Object.values(Category)].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat as any)} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-primary text-white' : 'text-gray-500'}`}>
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div id="products-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {isLoading ? Array(8).fill(0).map((_, i) => <SkeletonProduct key={i} />) : filteredProducts.map(product => <ProductCard key={product.id} product={product} isWishlisted={wishlist.includes(product.id)} onAddToCart={(p) => addToCart(p)} onViewDetails={setSelectedProduct} onToggleWishlist={toggleWishlist} />)}
        </div>
      </main>

      <Footer />

      <StyleMatcher isOpen={isStyleMatcherOpen} onClose={() => setIsStyleMatcherOpen(false)} language={language} onAddToCart={addToCart} />
      <AuthenticityVerifier isOpen={isVerifierOpen} onClose={() => setIsVerifierOpen(false)} language={language} />
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} savedItems={savedForLater} onRemoveItem={removeFromCart} onUpdateQuantity={updateQuantity} onSaveForLater={() => {}} onMoveToCart={() => {}} onRemoveSaved={() => {}} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} items={products.filter(p => wishlist.includes(p.id))} onRemoveItem={toggleWishlist} onAddToCart={(p) => addToCart(p)} />
      <OrderTracker isOpen={isOrderTrackerOpen} onClose={() => setIsOrderTrackerOpen(false)} orders={orders} />
      <ProductModal isOpen={!!selectedProduct} product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} onAddReview={handleAddReview} language={language} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cart} onPlaceOrder={handlePlaceOrder} coupons={coupons} />
      
      {/* Admin Panel Components */}
      <AdminLoginModal 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)} 
        onLogin={() => setIsAdminDashboardOpen(true)} 
      />
      {isAdminDashboardOpen && (
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
          onAddReview={handleAddReview}
          onClose={() => setIsAdminDashboardOpen(false)}
        />
      )}

      <WarrantyPortal isOpen={isWarrantyPortalOpen} onClose={() => setIsWarrantyPortalOpen(false)} />
      <AIAssistant />
      <LiveSalesNotification />
      <WhatsAppButton />
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </div>
  );
};

export default App;
