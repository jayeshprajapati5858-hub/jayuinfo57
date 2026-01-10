
import React from 'react';
import { X, Shield, FileText, Info } from 'lucide-react';
import { SHOP_NAME } from '../constants';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | 'about' | null;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">About {SHOP_NAME}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Welcome to {SHOP_NAME}, your number one source for all things mobile accessories. We're dedicated to giving you the very best of chargers, covers, and screen guards, with a focus on quality, customer service, and uniqueness.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Founded in 2024, {SHOP_NAME} has come a long way from its beginnings in Gujarat. When we first started out, our passion for "Quality Tech for Everyone" drove us to quit our day job, do tons of research, so that {SHOP_NAME} can offer you India's most reliable mobile accessories.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We now serve customers all over India and are thrilled that we're able to turn our passion into our own website. We hope you enjoy our products as much as we enjoy offering them to you.
            </p>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Privacy Policy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              At {SHOP_NAME}, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {SHOP_NAME} and how we use it.
            </p>
            <h4 className="font-bold text-sm">Information We Collect</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. We use this information to process your orders and communicate with you.
            </p>
            <h4 className="font-bold text-sm">Cookies and Web Beacons</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Like any other website, {SHOP_NAME} uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>
            <h4 className="font-bold text-sm">Google DoubleClick DART Cookie</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site.
            </p>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Terms and Conditions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Welcome to {SHOP_NAME}! These terms and conditions outline the rules and regulations for the use of {SHOP_NAME}'s Website.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              By accessing this website we assume you accept these terms and conditions. Do not continue to use {SHOP_NAME} if you do not agree to take all of the terms and conditions stated on this page.
            </p>
            <h4 className="font-bold text-sm">License</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Unless otherwise stated, {SHOP_NAME} and/or its licensors own the intellectual property rights for all material on {SHOP_NAME}. All intellectual property rights are reserved. You may access this from {SHOP_NAME} for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <h4 className="font-bold text-sm">Hyperlinking to our Content</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Organizations may link to our home page, to publications, or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'about': return <Info size={24} className="text-primary" />;
      case 'privacy': return <Shield size={24} className="text-green-500" />;
      case 'terms': return <FileText size={24} className="text-orange-500" />;
      default: return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'about': return "About Us";
      case 'privacy': return "Privacy Policy";
      case 'terms': return "Terms & Conditions";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
             <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm">
                {getIcon()}
             </div>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">{getTitle()}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8">
           {renderContent()}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-center">
            <button onClick={onClose} className="bg-gray-900 dark:bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
