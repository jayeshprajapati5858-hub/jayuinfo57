
import React from 'react';
import { CartItem, Product } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, Bookmark, Coins } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  savedItems: Product[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
  onSaveForLater: (item: CartItem) => void;
  onMoveToCart: (product: Product) => void;
  onRemoveSaved: (id: string) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  savedItems,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  onSaveForLater,
  onMoveToCart,
  onRemoveSaved
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const coinsToEarn = Math.floor(total * 0.05);

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="text-primary" /> Cart
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Cart Items */}
            <div className="space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}`} className="flex gap-4 group">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                      {item.selectedColor && <p className="text-[10px] font-bold text-gray-500 uppercase">Color: {item.selectedColor}</p>}
                      <p className="text-xs text-gray-500 mb-2">₹{item.price.toLocaleString()}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-2 py-1 text-gray-600 dark:text-gray-400 disabled:opacity-30" disabled={item.quantity <= 1}>-</button>
                          <span className="px-2 text-sm font-medium w-8 text-center dark:text-white">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-2 py-1 text-gray-600 dark:text-gray-400">+</button>
                        </div>
                        <button onClick={() => onSaveForLater(item)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                          <Bookmark size={14} /> Save
                        </button>
                      </div>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors self-start"><Trash2 size={18} /></button>
                  </div>
                ))
              )}
            </div>

            {/* Saved Items Section */}
            {savedItems.length > 0 && (
              <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bookmark size={16} className="text-primary fill-primary" /> Saved for Later ({savedItems.length})
                </h3>
                <div className="space-y-4">
                  {savedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-500">₹{item.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => onMoveToCart(item)} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                          <ShoppingBag size={14} />
                        </button>
                        <button onClick={() => onRemoveSaved(item.id)} className="p-2 text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between mb-4 bg-primary/5 dark:bg-primary/20 p-3 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2">
                  <Coins size={18} className="text-accent" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Loyalty Rewards</span>
                </div>
                <span className="text-xs font-bold text-primary">+{coinsToEarn} Coins</span>
              </div>
              <div className="flex justify-between mb-6 text-xl font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <button onClick={onCheckout} className="w-full bg-gray-900 dark:bg-primary text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                Checkout Now <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
