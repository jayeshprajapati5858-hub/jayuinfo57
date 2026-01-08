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
    <div className={`group bg-white dark:bg-gray-900 rounded-[24px] sm:rounded-[32px] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-gray-50 dark:border-gray-800 flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''} animate-fadeInUp`}>
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 cursor-pointer p-3 sm:p-4"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
          loading="lazy"
        />
        
        {/* Wishlist */}
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
            className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur p-2 rounded-full shadow-sm z-10 hover:scale-110 transition-transform"
        >
            <Heart size={14} className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Dispatch Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <div className="bg-green-500 text-white text-[7px] sm:text-[8px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg w-fit uppercase tracking-tighter">
            <RotateCcw size={8} /> {t.return_policy}
          </div>
          <div className="bg-blue-600 text-white text-[7px] sm:text-[8px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg w-fit uppercase tracking-tighter animate-[pulse-soft_2s_infinite]">
            <Zap size={8} fill="currentColor" /> {t.next_day_dispatch}
          </div>
        </div>

        {/* Rating */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-[8px] font-black text-white z-10">
          <Star size={8} className="fill-yellow-400 text-yellow-400" />
          {product.rating}
        </div>
      </div>
      
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-widest mb-3">{product.category}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
             <span className="text-base sm:text-xl font-black text-gray-900 dark:text-white italic">₹{product.price.toLocaleString()}</span>
             {isOutOfStock && <span className="text-[10px] font-bold text-red-500 uppercase">Sold Out</span>}
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              disabled={isOutOfStock}
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 ${isOutOfStock ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-transparent border-gray-900 dark:border-primary text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-primary hover:text-white active:scale-95'}`}
            >
              <ShoppingCart size={14} /> {t.add_to_cart}
            </button>
            <button 
              disabled={isOutOfStock}
              onClick={(e) => { e.stopPropagation(); onBuyNow(product); }}
              className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg relative overflow-hidden ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 dark:bg-primary text-white hover:scale-[1.02] active:scale-95 group/btn'}`}
            >
              <span className="relative z-10 flex items-center gap-2">Buy Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite_linear]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;