
import React, { useState, useRef, useEffect } from 'react';
import { Gift, Sparkles } from 'lucide-react';

interface ScratchCardProps {
  onComplete: (code: string) => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ onComplete }) => {
  const [isScratched, setIsScratched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const scratchedPixelsRef = useRef(0);
  const totalPixelsRef = useRef(0);

  const couponCode = "LUCKY15";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with scratching layer
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some pattern/text to the cover
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);

    totalPixelsRef.current = canvas.width * canvas.height;
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Check progress every 10 scratches
    scratchedPixelsRef.current++;
    if (scratchedPixelsRef.current > 50) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) transparent++;
      }
      
      const percent = (transparent / totalPixelsRef.current) * 100;
      if (percent > 40) {
        setIsScratched(true);
        onComplete(couponCode);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  return (
    <div className="relative w-64 h-32 mx-auto bg-gradient-to-br from-primary to-indigo-600 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
      {/* Revealed Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
        <Sparkles className="text-yellow-300 mb-1" size={24} />
        <p className="text-[10px] uppercase font-black tracking-widest opacity-80">Next Order Coupon</p>
        <h3 className="text-2xl font-black">{couponCode}</h3>
        <p className="text-[10px] font-bold">15% EXTRA OFF</p>
      </div>

      {/* Scratch Layer */}
      <canvas
        ref={canvasRef}
        width={256}
        height={128}
        className={`absolute inset-0 cursor-crosshair touch-none transition-opacity duration-500 ${isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseDown={() => (isDrawingRef.current = true)}
        onMouseUp={() => (isDrawingRef.current = false)}
        onMouseLeave={() => (isDrawingRef.current = false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => (isDrawingRef.current = true)}
        onTouchEnd={() => (isDrawingRef.current = false)}
        onTouchMove={handleTouchMove}
      />

      {isScratched && (
        <div className="absolute inset-0 bg-green-500 flex items-center justify-center animate-in zoom-in duration-300">
           <div className="text-white flex flex-col items-center">
              <Gift size={32} />
              <span className="font-black text-sm uppercase">CASHBACK REVEALED!</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default ScratchCard;
