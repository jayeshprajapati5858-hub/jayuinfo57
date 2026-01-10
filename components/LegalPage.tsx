
import React from 'react';
import { Shield, FileText, Info, Smartphone, Mail } from 'lucide-react';
import { SHOP_NAME } from '../constants';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'about' | 'contact';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
               <Info className="text-primary" /> About {SHOP_NAME}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Welcome to <strong>{SHOP_NAME}</strong>, your number one source for all things mobile accessories. We're dedicated to giving you the very best of chargers, covers, and screen guards, with a focus on quality, customer service, and uniqueness.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Founded in 2024, {SHOP_NAME} has come a long way from its beginnings in Gujarat. When we first started out, our passion for "Quality Tech for Everyone" drove us to quit our day job, do tons of research, so that {SHOP_NAME} can offer you India's most reliable mobile accessories. We now serve customers all over India and are thrilled that we're able to turn our passion into our own website.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 mt-8">
               <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Our Mission</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400">To provide premium quality mobile accessories at affordable prices while ensuring the best customer experience through fast shipping and responsive support.</p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
               <Shield className="text-green-500" /> Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Information We Collect</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  When you visit {SHOP_NAME}, we may collect personal information such as your name, email address, phone number, and shipping address when you place an order. We also collect non-personal information like browser type and IP address for analytics purposes.
                </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  We use the information we collect to process your orders, communicate with you about your purchase, improve our website, and comply with legal obligations. We do not sell your personal data to third parties.
                </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Cookies</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {SHOP_NAME} uses cookies to store information about visitors' preferences and to optimize the user experience. You can choose to disable cookies through your individual browser options.
                </p>
            </section>
             
             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Google AdSense</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
                </p>
            </section>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
               <FileText className="text-orange-500" /> Terms & Conditions
            </h1>
            
            <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Introduction</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  These terms and conditions outline the rules and regulations for the use of {SHOP_NAME}'s Website. By accessing this website we assume you accept these terms and conditions.
                </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. License</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Unless otherwise stated, {SHOP_NAME} and/or its licensors own the intellectual property rights for all material on {SHOP_NAME}. All intellectual property rights are reserved.
                </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. User Accounts</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.
                </p>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
