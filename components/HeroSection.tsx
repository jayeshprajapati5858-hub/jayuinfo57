
import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeroSectionProps {
  onShopNow: () => void;
  language: Language;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="relative bg-gray-900 rounded-[32px] overflow-hidden mb-8 text-white shadow-2xl animate-fadeInUp">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80" 
          alt="Mobile Accessories" 
          className="w-full h-full object-cover opacity-50 transition-transform duration-[10s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent md:bg-gradient-to-r"></div>
      </div>

      <div className="relative z-10 px-6 py-12 md:py-20 md:px-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-blue-300 border border-primary/30 text-[10px] font-black uppercase tracking-widest mb-4 animate-fadeInUp stagger-1">
          <Zap size={12} fill="currentColor" /> {t.hero_badge}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-none italic uppercase tracking-tighter animate-fadeInUp stagger-2">
          {t.hero_title_1} <br />
          <span className="text-primary">{t.hero_title_2}</span>
        </h1>
        
        <p className="text-gray-300 text-sm md:text-lg mb-8 max-w-md animate-fadeInUp stagger-3 font-medium">
          {t.hero_desc}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 animate-fadeInUp stagger-3">
          <button 
            onClick={onShopNow}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95 overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">{t.shop_now} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite_linear]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
