import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div 
      className={`fixed top-24 right-4 z-[60] flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'
      }`}
    >
      <CheckCircle className="text-green-400" size={20} />
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

export default Toast;