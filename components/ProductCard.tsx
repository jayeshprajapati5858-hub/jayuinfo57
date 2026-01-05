
import React from 'react';
import { Product } from '../types';
import { Plus, Star, Eye, Heart, Truck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isWishlisted,
  onAddToCart, 
  onViewDetails,
  onToggleWishlist
}) => {
  const isOutOfStock = product.stock === 0;

  // Simple logic for delivery date: If today is before 2 PM, delivery is tomorrow.
  const getDeliveryText = () => {
    const now = new Date();
    const isEarly = now.getHours() < 14;
    return isEarly ? "Delivery Tomorrow" : "Delivery in 2 Days";
  };

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-2xl dark:hover:shadow-gray-950/50 transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900 cursor-pointer p-4"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 dark:mix-blend-normal ${isOutOfStock ? 'grayscale' : ''}`}
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
            }}
            className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-2.5 rounded-2xl shadow-sm hover:scale-110 active:scale-95 transition-all z-20"
        >
            <Heart 
                size={18} 
                className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500 hover:text-red-500'}`} 
            />
        </button>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-gray-900/90 dark:bg-gray-700/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-black shadow-lg text-white z-10">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          {product.rating}
        </div>

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
            <span className="bg-red-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transform -rotate-6 shadow-2xl border-2 border-white/20">
              Sold Out
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
           <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
             {product.category}
           </span>
           <div className="flex items-center gap-1 text-[9px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
              <Truck size={10} /> {getDeliveryText()}
           </div>
        </div>
        
        <h3 
          className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 leading-tight cursor-pointer hover:text-primary transition-colors"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-700/50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">₹{(product.price * 1.3).toFixed(0)}</span>
            <span className="text-xl font-black text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
          
          <button 
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 text-sm font-black uppercase tracking-widest active:scale-95 ${
              isOutOfStock 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 dark:bg-primary hover:bg-primary dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-primary/30'
            }`}
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
