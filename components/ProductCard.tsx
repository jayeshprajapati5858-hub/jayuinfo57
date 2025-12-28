
import React from 'react';
import { Product } from '../types';
import { Plus, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div 
        className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'grayscale' : ''}`}
          loading="lazy"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-sm text-gray-700">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          {product.rating}
        </div>

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm tracking-wider transform -rotate-12 shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Overlay with View Button */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Eye size={16} /> View Details
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
           <div className="text-xs font-medium text-primary uppercase tracking-wide">
             {product.category}
           </div>
           {product.stock > 0 && product.stock < 10 && (
             <div className="text-xs font-bold text-red-500 animate-pulse">
               Only {product.stock} left!
             </div>
           )}
        </div>
        
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          <button 
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium active:scale-95 ${
              isOutOfStock 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 hover:bg-primary text-white'
            }`}
          >
            <Plus size={16} />
            {isOutOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
