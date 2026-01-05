
import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

const WishlistSidebar: React.FC<WishlistSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemoveItem,
  onAddToCart
}) => {
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
              <Heart className="text-primary fill-primary" />
              My Wishlist
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Heart size={64} className="mb-4 opacity-20" />
                <p>Your wishlist is empty.</p>
                <button onClick={onClose} className="mt-4 text-primary font-medium hover:underline">
                  Browse Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm font-bold text-gray-900 mt-1">₹{item.price.toLocaleString()}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                        <button 
                            onClick={() => onAddToCart(item)}
                            className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary transition-colors"
                        >
                            <ShoppingCart size={14} /> Add to Cart
                        </button>
                        <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistSidebar;
