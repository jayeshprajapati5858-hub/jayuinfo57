
import React, { useState, useRef } from 'react';
import { Camera, Sparkles, X, Loader2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { matchOutfitToAccessories } from '../services/geminiService';
import { TRANSLATIONS, PRODUCTS } from '../constants';
import { Product, Language } from '../types';

interface StyleMatcherProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddToCart: (p: Product) => void;
}

const StyleMatcher: React.FC<StyleMatcherProps> = ({ isOpen, onClose, language, onAddToCart }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultText, setResultText] = useState('');
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setResultText('');
    setMatchedProducts([]);

    const base64Data = image.split(',')[1];
    const response = await matchOutfitToAccessories(base64Data);
    
    setResultText(response || 'No matches found.');
    
    // Extract IDs from response (e.g., "ID: 1")
    const foundIds = PRODUCTS.filter(p => response?.includes(`ID: ${p.id}`) || response?.includes(`(ID: ${p.id})`));
    setMatchedProducts(foundIds);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 z-10">
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Uploader */}
          <div className="w-full md:w-1/2 p-10 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col justify-center items-center text-center">
            <Sparkles className="mb-6 text-yellow-300 animate-pulse" size={48} />
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{t.style_matcher}</h2>
            <p className="text-sm opacity-80 mb-8">{t.upload_outfit}</p>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square bg-white/10 border-4 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all overflow-hidden relative group"
            >
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="Outfit" />
              ) : (
                <>
                  <Camera size={40} className="mb-2 opacity-50" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Select Image</span>
                </>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-xs font-bold uppercase tracking-widest">Change Photo</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            {image && !isAnalyzing && (
              <button 
                onClick={handleAnalyze}
                className="mt-8 w-full bg-white text-indigo-700 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                Match My Style
              </button>
            )}
          </div>

          {/* Right: Results */}
          <div className="w-full md:w-1/2 p-10 bg-white dark:bg-gray-900 flex flex-col max-h-[500px] overflow-y-auto">
             {isAnalyzing ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Loader2 size={48} className="animate-spin text-primary mb-4" />
                  <p className="font-bold text-gray-500 uppercase text-xs tracking-[0.2em]">{t.analyzing}</p>
               </div>
             ) : resultText ? (
               <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-2 text-green-500 font-black uppercase text-[10px] mb-4 tracking-widest">
                     <CheckCircle2 size={16} /> Analysis Complete
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed italic">{resultText}</p>
                  
                  {matchedProducts.length > 0 && (
                    <div className="space-y-4">
                       <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Matched For You</h4>
                       {matchedProducts.map(p => (
                         <div key={p.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary transition-colors group">
                            <img src={p.image} className="w-12 h-12 object-contain bg-white rounded-lg" />
                            <div className="flex-1 min-w-0">
                               <p className="text-xs font-bold truncate dark:text-white uppercase">{p.name}</p>
                               <p className="text-[10px] font-black text-primary">₹{p.price}</p>
                            </div>
                            <button onClick={() => onAddToCart(p)} className="p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                               <ShoppingBag size={14} />
                            </button>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 italic">
                  <Sparkles size={48} className="mb-4" />
                  <p className="text-xs uppercase font-black tracking-widest">Awaiting Input</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleMatcher;
