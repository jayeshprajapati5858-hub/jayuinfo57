
import React, { useState } from 'react';
import { ShoppingCart, Smartphone, Search, Package, Heart, Sun, Moon, User as UserIcon, LogOut } from 'lucide-react';
import { Language, User } from '../types';
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
  language: Language;
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
  language
}) => {
  const t = TRANSLATIONS[language];
  const [clickCount, setClickCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      onAdminClick();
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          <div 
            className="flex items-center gap-2 flex-shrink-0 cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <div className="bg-primary p-2 rounded-lg text-white">
              <Smartphone size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hidden sm:block">
              {t.shop_name}
            </span>
          </div>

          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.search_placeholder}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-750 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button 
              onClick={onToggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Button */}
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 pl-3 bg-gray-100 dark:bg-gray-800 rounded-full border dark:border-gray-700 hover:shadow-sm transition-all"
                >
                  <span className="text-xs font-bold dark:text-white hidden lg:block">{currentUser.name.split(' ')[0]}</span>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                    <UserIcon size={16} />
                  </div>
                </button>
                
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 z-50 p-2 animate-in slide-in-from-top-2">
                       <button onClick={onOrdersClick} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                         <Package size={18} /> {t.orders}
                       </button>
                       <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                       <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                         <LogOut size={18} /> Logout
                       </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={onAuthClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-primary text-white text-xs font-bold rounded-full hover:shadow-lg transition-all"
              >
                <UserIcon size={16} /> <span className="hidden sm:block">Login</span>
              </button>
            )}

            <button 
              onClick={onWishlistClick}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Heart size={24} />
              {wishlistItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900">
                  {wishlistItemCount}
                </span>
              )}
            </button>

            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full border-2 border-white dark:border-gray-900">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
