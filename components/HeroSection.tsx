
import React from 'react';
import { ArrowRight, Zap, Star } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeroSectionProps {
  onShopNow: () => void;
  language: Language;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-[32px] overflow-hidden mb-12 text-white shadow-2xl shadow-blue-900/20 animate-fadeInUp">
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

      <div className="relative z-10 px-6 py-12 md:py-20 md:px-16 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest mb-6 animate-fadeInUp stagger-1 shadow-sm text-blue-100">
            <Zap size={14} className="text-yellow-400 fill-yellow-400 animate-pulse" /> {t.hero_badge}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight animate-fadeInUp stagger-2 drop-shadow-lg">
            {t.hero_title_1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{t.hero_title_2}</span>
          </h1>
          
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 animate-fadeInUp stagger-3 font-medium leading-relaxed opacity-90">
            {t.hero_desc}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fadeInUp stagger-3">
            <button 
              onClick={onShopNow}
              className="px-8 py-4 bg-white text-blue-700 rounded-full font-bold uppercase tracking-widest shadow-xl shadow-white/20 flex items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95"
            >
              {t.shop_now} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-4 px-6 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-gray-300 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <div className="text-left">
                    <div className="flex text-yellow-400 text-xs"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                    <span className="text-[10px] font-bold opacity-80">10k+ Reviews</span>
                </div>
            </div>
          </div>
        </div>

        {/* Hero Image / Graphic */}
        <div className="flex-1 relative hidden md:block animate-[float_6s_ease-in-out_infinite]">
            <img 
               src="https://images.unsplash.com/photo-1603539279542-e5180f635166?q=80&w=1000&auto=format&fit=crop" 
               alt="Hero Product" 
               className="relative z-10 w-full max-w-md mx-auto rounded-[40px] shadow-2xl shadow-indigo-500/50 border-8 border-white/10 rotate-[-6deg] hover:rotate-0 transition-all duration-700"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/30 blur-3xl rounded-full -z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
