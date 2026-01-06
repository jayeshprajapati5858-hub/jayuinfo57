
import React from 'react';
import { Product } from '../types';
import { Plus, Star, Heart, RotateCcw } from 'lucide-react';

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
    <div className={`group bg-white dark:bg-gray-900 rounded-[24px] sm:rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-50 dark:border-gray-800 flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 cursor-pointer p-3 sm:p-4"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'grayscale' : ''}`}
          loading="lazy"
        />
        
        {/* Wishlist */}
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
            className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur p-2 rounded-full shadow-sm"
        >
            <Heart size={14} className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* 7 Days Badge */}
        <div className="absolute top-2 left-2 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
          <RotateCcw size={8} /> 7 DAYS RETURN
        </div>

        {/* Rating */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-[8px] font-black text-white">
          <Star size={8} className="fill-yellow-400 text-yellow-400" />
          {product.rating}
        </div>
      </div>
      
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 leading-tight">{product.name}</h3>
        <p className="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-widest mb-2">{product.category}</p>
        
        <div className="mt-auto pt-3 border-t border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
          <span className="text-sm sm:text-xl font-black text-gray-900 dark:text-white italic">₹{product.price.toLocaleString()}</span>
          
          <button 
            disabled={isOutOfStock}
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className={`p-2 sm:px-4 sm:py-2 rounded-xl transition-all ${isOutOfStock ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 dark:bg-primary text-white shadow-lg hover:scale-110 active:scale-95'}`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
