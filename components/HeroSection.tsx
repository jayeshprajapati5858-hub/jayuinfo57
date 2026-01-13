
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
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-[32px] overflow-hidden mb-8 text-white shadow-2xl animate-fadeInUp">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80" 
          alt="Mobile Accessories" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay transition-transform duration-[10s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
      </div>

      <div className="relative z-10 px-6 py-12 md:py-24 md:px-12 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-indigo-200 border border-white/20 text-[10px] font-black uppercase tracking-widest mb-6 animate-fadeInUp stagger-1 shadow-lg">
          <Zap size={12} className="text-yellow-400 fill-yellow-400" /> {t.hero_badge}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight italic uppercase tracking-tighter animate-fadeInUp stagger-2 drop-shadow-xl">
          {t.hero_title_1} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">{t.hero_title_2}</span>
        </h1>
        
        <p className="text-gray-200 text-sm md:text-xl mb-8 max-w-lg animate-fadeInUp stagger-3 font-medium leading-relaxed opacity-90">
          {t.hero_desc}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp stagger-3">
          <button 
            onClick={onShopNow}
            className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-white/10 flex items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95 overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">{t.shop_now} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
