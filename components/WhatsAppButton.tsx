
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const openWhatsApp = () => {
    const phoneNumber = "919876543210"; // Replace with actual number
    const message = "Hello MobileHub! I have a question about your products.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <button 
      onClick={openWhatsApp}
      className="fixed bottom-6 left-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={24} fill="white" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap font-bold text-sm">
        Help? Chat with us
      </span>
    </button>
  );
};

export default WhatsAppButton;
