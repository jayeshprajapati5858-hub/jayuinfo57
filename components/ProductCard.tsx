
import React from 'react';
import { Product, Language } from '../types';
import { Star, Heart, RotateCcw, Zap, ShoppingCart, ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  language: Language;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isWishlisted,
  onAddToCart, 
  onBuyNow,
  onViewDetails,
  onToggleWishlist,
  language
}) => {
  const isOutOfStock = product.stock === 0;
  const t = TRANSLATIONS[language];

  return (
    <div className={`group bg-white dark:bg-gray-900 rounded-[2rem] shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''} animate-fadeInUp`}>
      <div 
        className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-800/50 cursor-pointer p-6"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
            className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm z-10 hover:scale-110 transition-transform active:scale-95"
        >
            <Heart size={16} className={`transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <div className="bg-emerald-500/90 backdrop-blur-sm text-white text-[8px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wide">
             {t.return_policy}
          </div>
          <div className="bg-blue-600/90 backdrop-blur-sm text-white text-[8px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wide">
             <Zap size={8} fill="currentColor" /> {t.next_day_dispatch}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow relative">
        <div className="absolute -top-4 right-5 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-gray-900 dark:text-white z-10">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          {product.rating}
        </div>

        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
        
        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between mb-4">
             <span className="text-xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
             {isOutOfStock && <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">SOLD OUT</span>}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button 
              disabled={isOutOfStock}
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className={`col-span-1 rounded-xl flex items-center justify-center transition-all active:scale-95 ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40'}`}
              title="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>
            <button 
              disabled={isOutOfStock}
              onClick={(e) => { e.stopPropagation(); onBuyNow(product); }}
              className={`col-span-3 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 dark:bg-blue-600 text-white hover:-translate-y-0.5 active:translate-y-0'}`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
