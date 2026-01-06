
import React from 'react';
import { ShoppingCart, Smartphone, Search, Package, Lock, Heart, Sun, Moon, Globe } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavbarProps {
  cartItemCount: number;
  wishlistItemCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOrdersClick: () => void;
  onAdminClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartItemCount, 
  wishlistItemCount,
  onCartClick, 
  onWishlistClick,
  searchTerm, 
  onSearchChange, 
  onOrdersClick,
  onAdminClick,
  darkMode,
  onToggleDarkMode,
  language,
  onLanguageChange
}) => {
  const t = TRANSLATIONS[language];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Smartphone size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hidden sm:block">
              {t.shop_name}
            </span>
          </div>

          {/* Search Bar */}
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

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1 border border-gray-200 dark:border-gray-700">
              <Globe size={14} className="text-gray-500" />
              <select 
                value={language} 
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none dark:text-white cursor-pointer"
              >
                <option value="en" className="text-black">EN</option>
                <option value="gu" className="text-black">GU</option>
                <option value="hi" className="text-black">HI</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={onToggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Admin Button Removed for Hidden Access Security */}

            {/* Orders Button */}
            <button 
              onClick={onOrdersClick}
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <Package size={18} />
              <span>{t.orders}</span>
            </button>
            <button 
              onClick={onOrdersClick}
              className="sm:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Package size={20} />
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={onWishlistClick}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Heart size={24} />
              {wishlistItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900">
                  {wishlistItemCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
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
