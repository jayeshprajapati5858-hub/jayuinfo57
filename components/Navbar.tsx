import React from 'react';
import { ShoppingCart, Smartphone, Search, Package, Lock } from 'lucide-react';

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOrdersClick: () => void;
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartItemCount, 
  onCartClick, 
  searchTerm, 
  onSearchChange, 
  onOrdersClick,
  onAdminClick 
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Smartphone size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hidden sm:block">
              MobileHub
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
                placeholder="Search chargers, cases..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Admin Button */}
             <button 
              onClick={onAdminClick}
              className="p-2 text-gray-600 hover:text-primary transition-colors duration-200 rounded-full hover:bg-gray-100"
              title="Admin Panel"
            >
              <Lock size={20} />
            </button>

            {/* Orders Button (Text on Desktop, Icon on Mobile) */}
            <button 
              onClick={onOrdersClick}
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
            >
              <Package size={18} />
              <span>Orders</span>
            </button>
            <button 
              onClick={onOrdersClick}
              className="sm:hidden p-2 text-gray-600 hover:text-primary transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
              <Package size={20} />
            </button>

            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
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