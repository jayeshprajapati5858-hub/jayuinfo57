
import React, { useState } from 'react';
import { Smartphone, CheckCircle2, ChevronRight } from 'lucide-react';

const MODELS = ["iPhone 15 Pro", "iPhone 14", "Samsung S24 Ultra", "OnePlus 12", "Pixel 8 Pro", "Nothing Phone (2)"];

const CompatibilityChecker: React.FC = () => {
  const [selected, setSelected] = useState('');

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-6 mb-12 text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Smartphone size={120} />
      </div>
      
      <div className="relative z-10 max-w-xl">
        <div className="flex items-center gap-2 mb-4 text-blue-300 font-bold text-xs uppercase tracking-widest">
           <span className="w-8 h-[2px] bg-blue-400"></span> Smart Finder
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Find the perfect fit for your device</h2>
        <p className="text-gray-300 mb-6 text-sm md:text-base">Select your phone model to see compatible cases, glass, and chargers instantly.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md text-white appearance-none cursor-pointer"
          >
            <option value="" className="text-gray-900">Select your Phone Model</option>
            {MODELS.map(m => <option key={m} value={m} className="text-gray-900">{m}</option>)}
          </select>
          <button className="bg-white text-blue-900 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group">
            Show Results <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {selected && (
          <div className="mt-4 flex items-center gap-2 text-green-400 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={16} />
            <span className="text-xs font-medium">Personalized results ready for {selected}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompatibilityChecker;
