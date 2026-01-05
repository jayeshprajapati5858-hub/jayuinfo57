
import React, { useState } from 'react';
import { Product, Review } from '../types';
import { X, Star, ShoppingCart, ShieldCheck, Truck, Send, User, RotateCcw, CheckCircle } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddReview: (productId: string, review: Review) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, onAddReview }) => {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [userName, setUserName] = useState('');

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock === 0;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !userName.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      userName: userName,
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toISOString().split('T')[0]
    };

    onAddReview(product.id, newReview);
    setReviewText('');
    setUserName('');
    setReviewRating(5);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors z-10 text-gray-500 dark:text-gray-400"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-800 p-8 flex items-center justify-center overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className={`w-full max-w-sm object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col overflow-y-auto bg-white dark:bg-gray-900">
            <div className="p-8 pb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                  <Star size={16} fill="currentColor" />
                  {product.rating} ({product.reviews.length} Reviews)
                </div>
                {product.sales ? <div className="text-xs text-green-600 dark:text-green-400 font-bold ml-2">{product.sales} People Bought</div> : null}
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h2>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{product.price.toLocaleString()}
                  <span className="text-lg text-gray-400 font-normal ml-2 line-through">
                    ₹{(product.price * 1.2).toFixed(0)}
                  </span>
                </div>
                {isOutOfStock ? (
                  <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-3 py-1 rounded-lg text-sm font-bold">Out of Stock</span>
                ) : (
                  <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-lg text-sm font-bold">In Stock ({product.stock})</span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {product.description} Built with premium materials for long-lasting performance and maximum protection for your devices.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <ShieldCheck className="text-primary" />
                  <div className="text-[10px] sm:text-xs">
                    <p className="font-semibold text-gray-900 dark:text-white">1 Year Warranty</p>
                    <p className="text-gray-500 dark:text-gray-400">Official Brand Support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <RotateCcw className="text-orange-500" />
                  <div className="text-[10px] sm:text-xs">
                    <p className="font-semibold text-gray-900 dark:text-white">7 Days Replacement</p>
                    <p className="text-gray-500 dark:text-gray-400">Hassle-free Exchange</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <Truck className="text-blue-500" />
                  <div className="text-[10px] sm:text-xs">
                    <p className="font-semibold text-gray-900 dark:text-white">Free Delivery</p>
                    <p className="text-gray-500 dark:text-gray-400">Fast & Secure Shipping</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <CheckCircle className="text-green-500" />
                  <div className="text-[10px] sm:text-xs">
                    <p className="font-semibold text-gray-900 dark:text-white">100% Genuine</p>
                    <p className="text-gray-500 dark:text-gray-400">Verified Quality Product</p>
                  </div>
                </div>
              </div>

              <button 
                disabled={isOutOfStock}
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isOutOfStock 
                  ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-gray-900 dark:bg-primary text-white hover:bg-primary dark:hover:bg-blue-700 shadow-gray-200 dark:shadow-none'
                }`}
              >
                <ShoppingCart size={20} />
                {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
              </button>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-8 bg-gray-50/50 dark:bg-gray-900/50 flex-grow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h3>
              
              {/* Add Review Form */}
              <form onSubmit={handleSubmitReview} className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold mb-3 dark:text-gray-200">Write a review</h4>
                <div className="flex gap-4 mb-3">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg outline-none focus:border-primary"
                    required
                  />
                  <select 
                    value={reviewRating} 
                    onChange={e => setReviewRating(Number(e.target.value))}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg outline-none focus:border-primary"
                  >
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                </div>
                <div className="relative">
                  <textarea 
                    placeholder="How was the product?" 
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg outline-none focus:border-primary resize-none"
                    rows={2}
                    required
                  />
                  <button type="submit" className="absolute bottom-2 right-2 p-1.5 bg-gray-900 dark:bg-primary text-white rounded-md hover:bg-primary transition-colors">
                    <Send size={14} />
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
                ) : (
                  product.reviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                             <User size={14} className="text-gray-500 dark:text-gray-400" />
                           </div>
                           <div>
                                <span className="font-semibold text-sm text-gray-900 dark:text-white block">{review.userName}</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 block">{new Date(review.date).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300 dark:text-gray-600" : ""} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{review.comment}</p>
                      
                      {review.image && (
                          <div className="mt-2">
                              <img src={review.image} alt="Customer Review" className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform" />
                          </div>
                      )}
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
