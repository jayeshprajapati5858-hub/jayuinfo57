
import React from 'react';
import { Product, Review } from '../types';
import { X, Star, ShoppingCart, RotateCcw, Zap } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddReview: (productId: string, review: Review) => void;
  language?: any;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, onAddReview, language = 'en' }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors z-10 text-gray-500 dark:text-gray-400">
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-800 p-8 flex items-center justify-center overflow-hidden">
            <img src={product.image} alt={product.name} className={`w-full max-w-sm object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-75' : ''}`} />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col overflow-y-auto bg-white dark:bg-gray-900">
            <div className="p-8 pb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">{product.category}</span>
                <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                  <Star size={16} fill="currentColor" />
                  {product.rating} ({product.reviews.length} Reviews)
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h2>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-6">₹{product.price.toLocaleString()}</div>

              {/* Badges Section */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800/50 shadow-sm">
                  <div className="p-2 bg-green-500 text-white rounded-xl">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-green-700 dark:text-green-400 tracking-tighter italic leading-none mb-1">{t.return_policy}</h4>
                    <p className="text-[8px] text-green-600 dark:text-green-500 font-medium leading-none">Replacement available</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
                  <div className="p-2 bg-blue-600 text-white rounded-xl">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 tracking-tighter italic leading-none mb-1">{t.next_day_dispatch}</h4>
                    <p className="text-[8px] text-blue-600 dark:text-blue-500 font-medium leading-none">Fastest Shipping</p>
                  </div>
                </div>
              </div>

              <button 
                disabled={isOutOfStock}
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className={`w-full py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-2 shadow-xl ${isOutOfStock ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-900 dark:bg-primary text-white hover:bg-primary hover:-translate-y-1 shadow-gray-200 dark:shadow-none italic uppercase tracking-widest'}`}
              >
                <ShoppingCart size={24} />
                {isOutOfStock ? 'Out of Stock' : t.add_to_cart}
              </button>
              
              <p className="mt-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Trusted by 50,000+ Customers across India
              </p>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-8 bg-gray-50/50 dark:bg-gray-900/50 flex-grow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Star size={20} className="text-yellow-400 fill-yellow-400" /> Customer Reviews
              </h3>
              <div className="space-y-4">
                {product.reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm italic">No reviews yet. Be the first one to review!</p>
                  </div>
                ) : (
                  product.reviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{review.userName}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
