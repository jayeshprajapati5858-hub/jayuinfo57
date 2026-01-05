
import React from 'react';
import { Product } from '../types';
import { Plus, Star, Eye, Heart } from 'lucide-react';

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

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-gray-950/50 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900 cursor-pointer p-2 sm:p-0"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-contain sm:object-cover object-center group-hover:scale-105 transition-transform duration-500 dark:mix-blend-normal ${isOutOfStock ? 'grayscale' : ''}`}
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
            }}
            className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-1.5 sm:p-2 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all z-20"
        >
            <Heart 
                size={16} 
                className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500 hover:text-red-500'}`} 
            />
        </button>

        {/* Rating Badge */}
        <div className="hidden sm:flex absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-2 py-1 rounded-full items-center gap-1 text-xs font-semibold shadow-sm text-gray-700 dark:text-gray-200 z-10">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          {product.rating}
        </div>

        {/* Mobile Rating */}
        <div className="sm:hidden absolute top-1 right-1 bg-white/90 dark:bg-gray-800/90 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm z-10">
           <Star size={8} className="fill-yellow-400 text-yellow-400" />
           <span className="text-[10px] font-bold dark:text-white">{product.rating}</span>
        </div>

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded text-[10px] sm:text-sm font-bold uppercase tracking-wider transform -rotate-12 shadow-lg">
              Sold Out
            </span>
          </div>
        )}
        
        {/* Overlay with View Button */}
        {!isOutOfStock && (
          <div className="hidden sm:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center z-10">
            <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur text-gray-900 dark:text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Eye size={16} /> View
            </span>
          </div>
        )}
      </div>
      
      <div className="p-2 sm:p-4 flex flex-col flex-grow">
        <div className="hidden sm:flex justify-between items-start mb-1">
           <div className="text-[10px] font-bold text-primary uppercase tracking-wide truncate">
             {product.category}
           </div>
        </div>
        
        {/* Title */}
        <h3 
          className="text-xs sm:text-lg font-medium sm:font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2 leading-tight cursor-pointer hover:text-primary transition-colors"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>
        
        <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto pt-2 sm:pt-4 border-t border-gray-50 dark:border-gray-700 gap-2 sm:gap-0">
          <span className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
            ₹{product.price.toLocaleString()}
          </span>
          
          <button 
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 text-[10px] sm:text-sm font-medium active:scale-95 ${
              isOutOfStock 
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
              : 'bg-gray-900 dark:bg-primary hover:bg-primary dark:hover:bg-blue-700 text-white'
            }`}
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="sm:inline">{isOutOfStock ? 'Sold' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
