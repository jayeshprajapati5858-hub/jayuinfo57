
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Smartphone, Search, Package, Heart, Sun, Moon, User as UserIcon, LogOut, Zap, ShieldCheck, Menu, X, Lock, Languages } from 'lucide-react';
import { User, Language } from '../types';
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
  onAuthClick: () => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
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
  onAuthClick,
  onLogout,
  darkMode,
  onToggleDarkMode,
  language,
  onToggleLanguage
}) => {
  const t = TRANSLATIONS[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-darkbg/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <div className="relative flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 text-white transform group-hover:rotate-12 transition-transform duration-300">
              <Smartphone size={20} className="relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white leading-none tracking-tight">
                {t.shop_name}
              </span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest mt-0.5">
                PREMIUM STORE
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-12 relative group">
            <input 
              type="text" 
              placeholder={t.search_placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100/80 dark:bg-gray-800/80 border border-transparent focus:border-blue-500 rounded-full outline-none text-sm font-medium dark:text-white transition-all group-hover:bg-white dark:group-hover:bg-gray-800 shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={18} />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
             
             {/* Language Toggle */}
             <button 
               onClick={onToggleLanguage}
               className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
             >
               <Languages size={18} className="text-gray-600 dark:text-gray-300" />
               <span className="text-xs font-bold text-gray-900 dark:text-white uppercase">{language}</span>
             </button>

             <button onClick={onToggleDarkMode} className="p-2.5 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-full transition-all">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             {currentUser ? (
               <div className="flex items-center gap-3 ml-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                 <div className="text-right hidden lg:block">
                   <p className="text-xs font-bold text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate('/profile')}>{currentUser.name}</p>
                 </div>
                 <div 
                   className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:scale-110 transition-transform"
                   onClick={() => navigate('/profile')}
                 >
                    {currentUser.name[0]}
                 </div>
               </div>
             ) : (
               <button onClick={onAuthClick} className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-sm hover:opacity-90 transition-opacity ml-2">
                  Login
               </button>
             )}

             <button onClick={onWishlistClick} className="relative p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 rounded-full transition-all ml-1">
                <Heart size={20} />
                {wishlistItemCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
             </button>

             <button onClick={onCartClick} className="relative ml-1 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group">
                <ShoppingCart size={20} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {cartItemCount}
                  </span>
                )}
             </button>
          </div>

          {/* Mobile Search Icon & Menu */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={onToggleLanguage} className="text-xs font-bold uppercase bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {language}
            </button>
            <button onClick={onCartClick} className="relative text-gray-900 dark:text-white">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
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
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-xl animate-in slide-in-from-top-2 z-50">
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
                   <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                         {currentUser.name[0]}
                      </div>
                      <span className="font-bold dark:text-white">{currentUser.name}</span>
                   </div>
                   <button onClick={onLogout} className="text-red-500 text-xs font-bold uppercase">Logout</button>
                </div>
              ) : (
                <button onClick={() => { onAuthClick(); setIsMenuOpen(false); }} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30">
                   Login / Signup
                </button>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => { onOrdersClick(); setIsMenuOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Package className="text-blue-500" />
                    <span className="text-xs font-bold dark:text-white">Orders</span>
                 </button>
                 <button onClick={() => { onWishlistClick(); setIsMenuOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Heart className="text-red-500" />
                    <span className="text-xs font-bold dark:text-white">Wishlist</span>
                 </button>
                 <button onClick={() => { onToggleDarkMode(); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-500" />}
                    <span className="text-xs font-bold dark:text-white">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
