import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemoveItem,
  onUpdateQuantity,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="text-primary" />
              Your Cart
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <ShoppingBag size={64} className="mb-4 opacity-20" />
                <p>Your cart is empty.</p>
                <button onClick={onClose} className="mt-4 text-primary font-medium hover:underline">
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-1 hover:bg-gray-50 text-gray-600 disabled:opacity-50 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                         <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors self-start"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-6 text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-primary transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
              >
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