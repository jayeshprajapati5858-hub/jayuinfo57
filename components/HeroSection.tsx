
import React from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  onShopNow: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow }) => {
  return (
    <div className="relative bg-gray-900 rounded-[32px] overflow-hidden mb-8 text-white shadow-2xl">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=1200&q=80" 
          alt="Mobile Accessories" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent md:bg-gradient-to-r"></div>
      </div>

      <div className="relative z-10 px-6 py-12 md:py-20 md:px-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-blue-300 border border-primary/30 text-[10px] font-black uppercase tracking-widest mb-4">
          <Zap size={12} fill="currentColor" /> Premium Gear 2026
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-none italic uppercase tracking-tighter">
          Power Your <br />
          <span className="text-primary">Digital Life</span>
        </h1>
        
        <p className="text-gray-400 text-sm md:text-lg mb-8 max-w-md">
          Discover high-performance chargers and ultra-rugged covers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onShopNow}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group transition-all"
          >
            Shop Now <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
