
import React from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  onShopNow: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow }) => {
  return (
    <div className="relative bg-gray-900 rounded-3xl overflow-hidden mb-12 text-white shadow-2xl mx-4 sm:mx-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1512054502232-10a0a035d672?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Mobile Accessories" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-16 md:py-24 md:px-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-blue-300 border border-primary/30 text-xs font-semibold uppercase tracking-wider mb-6">
          <Zap size={14} className="fill-blue-300" /> New Arrivals 2024
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Protect & Power <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Your Digital Life</span>
        </h1>
        
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Discover premium glass covers, ultra-fast GaN chargers, and rugged cases designed for modern smartphones.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={onShopNow}
            className="px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 group"
          >
            Shop Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all cursor-default border border-white/10">
            <ShieldCheck className="text-green-400" />
            <span className="font-medium">1 Year Warranty</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
