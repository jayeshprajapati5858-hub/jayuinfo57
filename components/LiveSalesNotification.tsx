
import React, { useState, useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { NOTIFICATION_NAMES, NOTIFICATION_CITIES, PRODUCTS } from '../constants';

const LiveSalesNotification: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', city: '', product: '' });

  const triggerNotification = () => {
    const randomName = NOTIFICATION_NAMES[Math.floor(Math.random() * NOTIFICATION_NAMES.length)];
    const randomCity = NOTIFICATION_CITIES[Math.floor(Math.random() * NOTIFICATION_CITIES.length)];
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)].name;
    
    setData({ name: randomName, city: randomCity, product: randomProduct });
    setVisible(true);
    
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      triggerNotification();
    }, 10000);

    const interval = setInterval(() => {
      triggerNotification();
    }, 25000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 sm:bottom-6 sm:left-6 z-[100] animate-fadeInUp">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4 max-w-[280px] sm:max-w-xs relative group hover:scale-105 transition-transform">
        <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl text-primary flex-shrink-0">
          <ShoppingBag size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {data.name} from {data.city}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            Just bought <span className="font-semibold text-primary">{data.product}</span>
          </p>
          <p className="text-[9px] text-gray-400 mt-1">Hurry, only a few left!</p>
        </div>
        <button onClick={() => setVisible(false)} className="absolute -top-2 -right-2 bg-gray-100 dark:bg-gray-700 text-gray-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

export default LiveSalesNotification;
