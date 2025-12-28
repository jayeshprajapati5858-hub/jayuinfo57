
import React, { useState } from 'react';
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
import { PRODUCTS, SHOP_NAME, INITIAL_COUPONS } from './constants';
import { Product, CartItem, Category, Order, Coupon, Review } from './types';
import { Zap, Shield, Smartphone, Headphones, Search, Lock } from 'lucide-react';

const App: React.FC = () => {
  // Products State (Admin can add/edit, stock updates)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
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
      showToast('Sorry, this item is out of stock!');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      // Check stock limit
      const currentQty = existing ? existing.quantity : 0;
      if (currentQty + 1 > product.stock) {
        showToast(`Only ${product.stock} items available in stock!`);
        return prev;
      }

      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`Added ${product.name} to cart`);
      return [...prev, { ...product, quantity: 1 }];
    });
    
    if (!isCartOpen) setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        // Check stock before increasing
        const product = products.find(p => p.id === id);
        if (delta > 0 && product && item.quantity >= product.stock) {
           showToast(`Max stock reached for this item`);
           return item;
        }
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleCheckoutOpen = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = (customerDetails: { name: string; address: string; city: string }, discount: number, finalTotal: number) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName: customerDetails.name,
      items: [...cartItems],
      total: total,
      discount: discount,
      finalTotal: finalTotal,
      date: new Date().toISOString(),
      status: 'Pending',
      address: `${customerDetails.address}, ${customerDetails.city}`
    };
    
    // Reduce Stock
    setProducts(prevProducts => prevProducts.map(prod => {
      const cartItem = cartItems.find(item => item.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
      }
      return prod;
    }));

    setOrders(prev => [...prev, newOrder]);
    setCartItems([]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'Shipped' | 'Rejected') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    showToast(`Order #${orderId.slice(-6)} marked as ${status}`);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    showToast('Product added successfully');
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Product deleted successfully');
    }
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const handleAddReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        // Recalculate rating
        const newReviews = [review, ...p.reviews];
        const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return { ...p, reviews: newReviews, rating: Number(avgRating.toFixed(1)) };
      }
      return p;
    }));
    // Update selected product view as well if open
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => {
         if (!prev) return null;
         const newReviews = [review, ...prev.reviews];
         const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
         return { ...prev, reviews: newReviews, rating: Number(avgRating.toFixed(1)) };
      });
    }
    showToast('Review submitted! Thank you.');
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [...prev, newCoupon]);
    showToast('Coupon created successfully');
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
  };

  // Improved filtering logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        cartItemCount={cartItemCount} 
        onCartClick={() => setIsCartOpen(true)} 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOrdersClick={() => setIsOrderTrackerOpen(true)}
        onAdminClick={() => setIsLoginOpen(true)}
      />

      {/* Sidebars & Modals */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckoutOpen}
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

      <OrderTracker 
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={orders}
      />

      <AdminLoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={() => setIsAdminOpen(true)}
      />

      {/* Admin Dashboard */}
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

      <Toast 
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight">
              Upgrade Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Mobile Life</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Premium chargers, durable glass guards, and stylish covers. 
              Quality you can trust, delivered to your doorstep.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('shop-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: 'Fast Charging', color: 'bg-yellow-500' },
              { icon: Shield, label: 'Glass Guard', color: 'bg-blue-500' },
              { icon: Smartphone, label: 'Premium Cases', color: 'bg-purple-500' },
              { icon: Headphones, label: 'HD Audio', color: 'bg-red-500' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
                <div className={`${feature.color} p-3 rounded-lg text-white shadow-md`}>
                  <feature.icon size={24} />
                </div>
                <span className="font-semibold text-gray-700">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Shop Area */}
        <div id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900">Latest Arrivals</h2>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'All' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                All
              </button>
              {Object.values(Category).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filter.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900">{SHOP_NAME}</h3>
              <p className="text-gray-500 mt-2">Quality Accessories for your Digital Lifestyle.</p>
            </div>
            <div className="flex gap-6 items-center">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <span className="text-gray-400 hover:text-primary cursor-pointer transition-colors">Instagram</span>
              <span className="text-gray-400 hover:text-primary cursor-pointer transition-colors">Facebook</span>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-8 flex justify-between items-center text-sm text-gray-400">
             <p>&copy; {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.</p>
             <button onClick={() => setIsLoginOpen(true)} className="flex items-center gap-1 hover:text-gray-600 transition-colors">
               <Lock size={14} /> Admin
             </button>
          </div>
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
};

export default App;
