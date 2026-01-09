
import React, { useState } from 'react';
import { ShoppingCart, Smartphone, Search, Package, Heart, Sun, Moon, User as UserIcon, LogOut, Zap, ShieldCheck, Menu, X, Lock } from 'lucide-react';
import { User } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavbarProps {
  cartItemCount: number;
  wishlistItemCount: number;
  currentUser: User | null;
  onCartClick: () => void;
  onWishlistClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOrdersClick: () => void;
  onAdminClick: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartItemCount, 
  wishlistItemCount, 
  currentUser,
  onCartClick, 
  onWishlistClick, 
  searchTerm, 
  onSearchChange, 
  onOrdersClick,
  onAdminClick,
  onAuthClick,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) => {
  const t = TRANSLATIONS['en'];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/20 text-white transform group-hover:scale-105 transition-transform duration-300">
              <Smartphone size={24} className="relative z-10 drop-shadow-md" />
              <Zap size={14} className="absolute top-1.5 right-1.5 text-yellow-300 fill-yellow-300 animate-pulse drop-shadow-sm" />
              <ShieldCheck size={14} className="absolute bottom-1.5 left-1.5 text-green-300 fill-green-500/20 drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">
                {t.shop_name}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary mt-0.5">
                Accessories
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <input 
              type="text" 
              placeholder={t.search_placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-primary rounded-2xl outline-none text-sm font-medium dark:text-white transition-all group-hover:bg-white dark:group-hover:bg-gray-700"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={20} />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
             {/* Admin Button */}
             <button onClick={onAdminClick} className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all" title="Admin Access">
                <Lock size={20} />
             </button>

             <button onClick={onToggleDarkMode} className="p-3 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl transition-all">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             {currentUser ? (
               <div className="flex items-center gap-4">
                 <div className="text-right hidden lg:block">
                   <p className="text-xs font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                   <p className="text-[10px] text-gray-500 cursor-pointer hover:text-primary" onClick={onLogout}>Logout</p>
                 </div>
                 <div className="w-10 h-10 bg-gradient-to-tr from-primary to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                    {currentUser.name[0]}
                 </div>
               </div>
             ) : (
               <button onClick={onAuthClick} className="p-3 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <UserIcon size={20} />
               </button>
             )}

             <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>

             <button onClick={onWishlistClick} className="relative p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                <Heart size={20} />
                {wishlistItemCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                )}
             </button>

             <button onClick={onCartClick} className="relative p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-gray-200 dark:shadow-none">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                    {cartItemCount}
                  </span>
                )}
             </button>
          </div>

          {/* Mobile Search Icon & Menu */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={onToggleDarkMode} className="text-gray-400">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={onCartClick} className="relative text-gray-900 dark:text-white">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-900 dark:text-white">
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2">
           <div className="p-4 space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={t.search_placeholder}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none text-sm dark:text-white"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>

              {currentUser ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                         {currentUser.name[0]}
                      </div>
                      <span className="font-bold dark:text-white">{currentUser.name}</span>
                   </div>
                   <button onClick={onLogout} className="text-red-500 text-xs font-bold uppercase">Logout</button>
                </div>
              ) : (
                <button onClick={() => { onAuthClick(); setIsMenuOpen(false); }} className="w-full py-3 bg-primary text-white rounded-xl font-bold">
                   Login / Signup
                </button>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => { onOrdersClick(); setIsMenuOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Package className="text-primary" />
                    <span className="text-xs font-bold dark:text-white">Orders</span>
                 </button>
                 <button onClick={() => { onWishlistClick(); setIsMenuOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Heart className="text-red-500" />
                    <span className="text-xs font-bold dark:text-white">Wishlist</span>
                 </button>
              </div>

              <div className="pt-2">
                 <button onClick={() => { onAdminClick(); setIsMenuOpen(false); }} className="text-xs text-gray-400 font-medium text-center w-full flex items-center justify-center gap-2">
                    <Lock size={12} /> Admin Access
                 </button>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
