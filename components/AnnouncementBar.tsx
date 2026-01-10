
import React from 'react';
import { Megaphone } from 'lucide-react';

interface AnnouncementBarProps {
  message: string;
  isVisible: boolean;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ message, isVisible }) => {
  // Return null if not visible, but also safeguard against empty strings effectively
  if (!isVisible && message) return null; 
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white text-xs md:text-sm font-bold py-3 px-4 text-center tracking-widest uppercase relative z-[100] shadow-md border-b border-white/10">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="flex items-center justify-center gap-3 animate-pulse relative z-10">
        <Megaphone size={18} className="text-yellow-400 fill-yellow-400" />
        <span className="drop-shadow-md text-white tracking-widest">{message || "Welcome to MobileHub! Sale is Live"}</span>
        <Megaphone size={18} className="text-yellow-400 fill-yellow-400 scale-x-[-1]" />
      </div>
    </div>
  );
};

export default AnnouncementBar;
