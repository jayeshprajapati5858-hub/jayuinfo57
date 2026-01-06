
import React, { useState, useEffect } from 'react';
import { Zap, Timer, Copy, X } from 'lucide-react';

const FlashSale: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 0 });
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText("FLASH40");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
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

          <button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto rounded-xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-orange-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-900/20"
          >
            Claim Offer Now
          </button>
        </div>
      </div>

      {/* Coupon Modal - Z-Index Increased to 120 */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
               <X size={20} />
            </button>
            
            <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Zap size={40} className="text-orange-500 fill-orange-500" />
            </div>
            
            <h3 className="text-2xl font-black uppercase italic mb-2 dark:text-white">Flash Sale Active!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Use this code at checkout to get 40% OFF on all Chargers.</p>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 mb-6 flex items-center justify-between gap-4">
               <span className="text-xl font-mono font-bold tracking-widest text-gray-900 dark:text-white">FLASH40</span>
               <button onClick={handleCopy} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                  {copied ? "Copied!" : <><Copy size={16} /> Copy</>}
               </button>
            </div>
            
            <button onClick={() => setShowModal(false)} className="w-full bg-gray-900 dark:bg-primary text-white py-3 rounded-xl font-bold">
               Shop Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashSale;
