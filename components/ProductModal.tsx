
import React, { useState } from 'react';
import { Product, Review, ProtectionPlan } from '../types';
import { X, Star, ShoppingCart, ShieldCheck, RotateCcw, CheckCircle, Check, MapPin, Loader2 } from 'lucide-react';
import { PINCODE_DATA, TRANSLATIONS } from '../constants';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, plan?: ProtectionPlan) => void;
  onAddReview: (productId: string, review: Review) => void;
  language?: any;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, onAddReview, language = 'en' }) => {
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ type: string, days: number } | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [withProtection, setWithProtection] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock === 0;

  const handleCheckPincode = () => {
    if (pincode.length !== 6) return;
    setIsCheckingPincode(true);
    setTimeout(() => {
      const result = PINCODE_DATA[pincode];
      setPincodeResult(result || null);
      if (!result) setPincodeResult({ type: 'Standard', days: 5 });
      setIsCheckingPincode(false);
    }, 1000);
  };

  const shieldPlan: ProtectionPlan = {
    id: 'shield-1',
    name: 'Mobile Shield Protection',
    price: 199,
    description: '1 Year accidental damage coverage'
  };

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

              {/* Return Policy Section */}
              <div className="mb-6 flex items-center gap-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800/50">
                <div className="p-2 bg-green-500 text-white rounded-xl">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase text-green-700 dark:text-green-400 tracking-tighter italic">{t.return_policy}</h4>
                  <p className="text-[10px] text-green-600 dark:text-green-500 font-medium leading-tight">{t.return_desc}</p>
                </div>
              </div>

              {/* Pincode Checker */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                 <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-3 tracking-widest">
                    <MapPin size={14} /> {t.check_delivery}
                 </div>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder={t.enter_pincode} 
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none text-sm dark:text-white" 
                    />
                    <button 
                      onClick={handleCheckPincode}
                      className="bg-gray-900 dark:bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      {isCheckingPincode ? <Loader2 size={16} className="animate-spin" /> : 'Check'}
                    </button>
                 </div>
                 {pincodeResult && (
                   <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-green-600 animate-in slide-in-from-top-1">
                      <CheckCircle size={14} />
                      {pincodeResult.type} Delivery in {pincodeResult.days} Day(s)
                   </div>
                 )}
              </div>

              {/* Protection Plan */}
              <div 
                className={`mb-8 p-4 rounded-2xl border transition-all cursor-pointer ${withProtection ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
                onClick={() => setWithProtection(!withProtection)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm dark:text-white uppercase italic">
                    <ShieldCheck size={18} className="text-primary" /> {t.protection_plan}
                  </div>
                  <span className="font-black text-primary">₹{shieldPlan.price}</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{t.protection_desc}</p>
                <div className="mt-3 flex items-center gap-2">
                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${withProtection ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                      {withProtection && <Check size={10} className="text-white" />}
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{withProtection ? 'Plan Added' : 'Add to protection'}</span>
                </div>
              </div>

              <button 
                disabled={isOutOfStock}
                onClick={() => {
                  onAddToCart(product, withProtection ? shieldPlan : undefined);
                  onClose();
                }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${isOutOfStock ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-900 dark:bg-primary text-white hover:bg-primary shadow-gray-200 dark:shadow-none italic uppercase'}`}
              >
                <ShoppingCart size={20} />
                {isOutOfStock ? 'Out of Stock' : t.add_to_cart}
              </button>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-8 bg-gray-50/50 dark:bg-gray-900/50 flex-grow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm">No reviews yet.</p>
                ) : (
                  product.reviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{review.userName}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
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
