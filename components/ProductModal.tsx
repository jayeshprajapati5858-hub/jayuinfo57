
import React, { useState, useEffect, useRef } from 'react';
import { Product, Review, User, Category } from '../types';
import { X, Star, ShoppingCart, RotateCcw, Zap, ArrowRight, Info, ChevronLeft, ChevronRight, MessageSquare, Check, Image as ImageIcon, Plus } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface ProductModalProps {
  product: Product | null;
  allProducts?: Product[]; // Added for combo logic
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void; 
  onAddReview: (productId: string, review: Review) => void;
  language?: any;
  currentUser?: User | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, allProducts = [], isOpen, onClose, onAddToCart, onBuyNow, onAddReview, language = 'en', currentUser }) => {
  const t = TRANSLATIONS['en'];
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewImage, setReviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combo State
  const [comboProduct, setComboProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
        setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');
        setActiveImage(product.images && product.images.length > 0 ? product.images[0] : product.image);
        setShowReviewForm(false);
        setReviewRating(5);
        setReviewComment('');
        setReviewImage(null);
        setReviewerName(currentUser ? currentUser.name : '');

        // Find combo logic
        if (product.category === Category.COVER && allProducts.length > 0) {
           const glass = allProducts.find(p => p.category === Category.GLASS);
           if (glass) setComboProduct(glass);
        } else if (product.category === Category.CHARGER && allProducts.length > 0) {
           const cable = allProducts.find(p => p.category === Category.CABLE);
           if (cable) setComboProduct(cable);
        } else {
           setComboProduct(null);
        }
    }
  }, [product, isOpen, currentUser, allProducts]);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock === 0;
  const hasMultipleImages = product.images && product.images.length > 1;

  const handleAddToCart = () => {
      onAddToCart({ ...product, selectedColor: selectedColor } as any); 
      onClose();
  };

  const handleBuyNow = () => {
      onBuyNow({ ...product, selectedColor: selectedColor } as any);
      onClose();
  };
  
  const handleAddCombo = () => {
    if (!comboProduct) return;
    onAddToCart({ ...product, selectedColor } as any);
    onAddToCart({ ...comboProduct }); // Standard add, logic handles separate items
    alert("Bundle added! 20% Discount applied in cart.");
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (!reviewerName.trim() || !reviewComment.trim()) return;
      
      const newReview: Review = {
          id: Date.now().toString(),
          userName: reviewerName,
          rating: reviewRating,
          comment: reviewComment,
          date: new Date().toISOString(),
          image: reviewImage || undefined
      };
      
      onAddReview(product.id, newReview);
      setShowReviewForm(false);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasMultipleImages) return;
    const currentIndex = product.images.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % product.images.length;
    setActiveImage(product.images[nextIndex]);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasMultipleImages) return;
    const currentIndex = product.images.indexOf(activeImage);
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setActiveImage(product.images[prevIndex]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors z-20 text-gray-500 dark:text-gray-400">
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-800 p-8 flex flex-col items-center justify-center overflow-hidden relative group">
            {hasMultipleImages && (
                <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all z-10 text-gray-800 dark:text-white opacity-0 group-hover:opacity-100"><ChevronLeft size={24} /></button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all z-10 text-gray-800 dark:text-white opacity-0 group-hover:opacity-100"><ChevronRight size={24} /></button>
                </>
            )}
            <div className="flex-1 flex items-center justify-center w-full">
                <img src={activeImage} alt={product.name} className={`w-full max-w-sm object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-75' : ''}`} />
            </div>
            {hasMultipleImages && (
                <div className="flex gap-2 mt-4 overflow-x-auto w-full px-2 justify-center z-10">
                    {product.images.map((img, idx) => (
                        <button key={idx} onClick={() => setActiveImage(img)} className={`w-14 h-14 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${activeImage === img ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col overflow-y-auto bg-white dark:bg-gray-900">
            <div className="p-8 pb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">{product.category}</span>
                <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                  <Star size={16} fill="currentColor" /> {product.rating} ({product.reviews.length} Reviews)
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">₹{product.price.toLocaleString()}</div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
              </div>

              {/* Combo Offer */}
              {comboProduct && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border border-purple-100 dark:border-gray-700 relative overflow-hidden">
                   <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">20% OFF</div>
                   <h4 className="font-bold text-sm text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
                      <Zap size={16} className="fill-purple-500 text-purple-500" /> Frequently Bought Together
                   </h4>
                   <div className="flex items-center gap-3">
                      <img src={comboProduct.image} className="w-12 h-12 object-cover rounded-lg bg-white" />
                      <div className="flex-1">
                         <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{comboProduct.name}</p>
                         <p className="text-[10px] text-gray-500">Add with {product.name}</p>
                      </div>
                      <button onClick={handleAddCombo} className="bg-gray-900 dark:bg-primary text-white px-3 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-transform">
                         Add Bundle
                      </button>
                   </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                  <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Color: <span className="text-primary dark:text-white ml-1">{selectedColor}</span></p>
                      <div className="flex flex-wrap gap-3">
                          {product.colors.map(color => (
                              <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${selectedColor === color ? 'bg-white dark:bg-gray-700 border-primary text-primary dark:text-white shadow-md transform scale-105' : 'bg-transparent border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'}`}>
                                {color}
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              <div className="flex gap-3 mt-auto">
                <button disabled={isOutOfStock} onClick={handleAddToCart} className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 border-2 ${isOutOfStock ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <ShoppingCart size={20} /> {isOutOfStock ? 'No Stock' : 'Add to Cart'}
                </button>
                <button disabled={isOutOfStock} onClick={handleBuyNow} className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-xl ${isOutOfStock ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-indigo-600 text-white hover:scale-[1.02] active:scale-95 shadow-primary/25 italic uppercase tracking-widest'}`}>
                  Buy Now <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-8 bg-gray-50/50 dark:bg-gray-900/50 flex-grow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" /> Customer Reviews
                </h3>
                <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    {showReviewForm ? <><X size={14}/> Cancel</> : <><MessageSquare size={14}/> Write a Review</>}
                </button>
              </div>

              {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Rating</label>
                          <div className="flex gap-2">
                              {[1,2,3,4,5].map(star => (
                                <button type="button" key={star} onClick={() => setReviewRating(star)}>
                                    <Star size={24} className={star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                                </button>
                              ))}
                          </div>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                          <input className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 dark:text-white outline-none focus:border-primary transition-colors" placeholder="John Doe" value={reviewerName} onChange={e => setReviewerName(e.target.value)} required />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Review</label>
                          <textarea rows={3} className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 dark:text-white outline-none focus:border-primary transition-colors resize-none" placeholder="Share your experience..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} required />
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Add Photo (Optional)</label>
                          <div className="flex items-center gap-4">
                             <div onClick={() => fileInputRef.current?.click()} className="w-20 h-20 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                {reviewImage ? <img src={reviewImage} className="w-full h-full object-cover rounded-lg" /> : <ImageIcon className="text-gray-400" />}
                             </div>
                             <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                             {reviewImage && <button type="button" onClick={() => setReviewImage(null)} className="text-xs text-red-500 font-bold">Remove</button>}
                          </div>
                      </div>
                      <button type="submit" className="w-full py-2 bg-gray-900 dark:bg-primary text-white rounded-lg font-bold text-sm hover:scale-[1.02] transition-transform">Submit Review</button>
                  </form>
              )}

              <div className="space-y-4">
                {product.reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm italic">No reviews yet. Be the first one to review!</p>
                  </div>
                ) : (
                  product.reviews.slice().reverse().map(review => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{review.userName}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                      {review.image && (
                          <div className="mt-3">
                              <img src={review.image} alt="User review" className="w-24 h-24 object-cover rounded-lg border border-gray-100 dark:border-gray-700" />
                          </div>
                      )}
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
