
import React, { useState, useEffect } from 'react';
import { Zap, Timer } from 'lucide-react';

const FlashSale: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 p-1">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-[22px] bg-white/10 backdrop-blur-md px-8 py-6 text-white">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white p-3 text-orange-600 shadow-xl shadow-orange-900/20">
            <Zap size={32} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter sm:text-3xl italic">Flash Sale</h2>
            <p className="text-sm font-medium text-orange-100">Premium GaN Chargers • Flat 40% OFF</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/20 px-6 py-4 rounded-2xl border border-white/20">
          <Timer className="text-orange-200" />
          <div className="flex gap-3 text-center">
            <div className="flex flex-col">
              <span className="text-2xl font-bold font-mono">{timeLeft.h.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase font-bold opacity-60">Hrs</span>
            </div>
            <span className="text-2xl font-bold opacity-40">:</span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold font-mono">{timeLeft.m.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase font-bold opacity-60">Min</span>
            </div>
            <span className="text-2xl font-bold opacity-40">:</span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold font-mono">{timeLeft.s.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase font-bold opacity-60">Sec</span>
            </div>
          </div>
        </div>

        <button className="w-full md:w-auto rounded-xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-orange-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-900/20">
          Claim Offer Now
        </button>
      </div>
    </div>
  );
};

export default FlashSale;
