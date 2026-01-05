
import React, { useState } from 'react';
import { ShieldCheck, X, Search, CheckCircle, Smartphone, Award, QrCode, Loader2 } from 'lucide-react';
import { TRANSLATIONS, SHOP_NAME } from '../constants';
import { Language } from '../types';

interface AuthenticityVerifierProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const AuthenticityVerifier: React.FC<AuthenticityVerifierProps> = ({ isOpen, onClose, language }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'verified' | 'error'>('idle');
  
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleVerify = () => {
    if (code.length < 5) return;
    setStatus('checking');
    setTimeout(() => {
      // Mock logic: codes starting with 'MH' are valid
      if (code.toUpperCase().startsWith('MH')) {
        setStatus('verified');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors z-20">
          <X size={24} />
        </button>

        {status === 'verified' ? (
          <div className="p-1 text-center bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-700 h-full">
             <div className="bg-white dark:bg-gray-900 m-2 rounded-[36px] p-10 h-full flex flex-col items-center">
                <Award className="text-amber-500 mb-4 animate-bounce" size={64} />
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter uppercase italic">{t.certificate_title}</h2>
                <div className="w-16 h-1 bg-amber-500 mb-6 rounded-full" />
                
                <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-dashed border-amber-200 p-6 rounded-3xl mb-8 w-full">
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-2">Verified Product</p>
                   <p className="text-xl font-bold dark:text-white uppercase mb-4 tracking-tight">Genuine MobileHub Accessory</p>
                   <div className="flex items-center justify-between text-[8px] font-mono text-gray-400">
                      <span>VERIFIED: {new Date().toLocaleDateString()}</span>
                      <span>ID: {code.toUpperCase()}</span>
                   </div>
                </div>

                <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-10">
                   <CheckCircle size={18} /> {t.verified_desc}
                </div>

                <button 
                  onClick={onClose}
                  className="w-full bg-gray-900 dark:bg-amber-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Close & Secure
                </button>
             </div>
          </div>
        ) : (
          <div className="p-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-4 bg-primary/10 rounded-3xl text-primary">
                  <ShieldCheck size={32} />
               </div>
               <div>
                  <h2 className="text-2xl font-black dark:text-white uppercase italic tracking-tighter">{t.verify_product}</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Anti-Fake Portal</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Enter Verification Code (e.g., MH123456)" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-transparent focus:border-primary outline-none font-bold text-lg dark:text-white transition-all uppercase tracking-widest placeholder:tracking-normal"
                  />
                  <QrCode size={24} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary" />
               </div>

               {status === 'error' && (
                 <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in shake duration-300">
                    <X size={16} /> INVALID CODE. Check the QR sticker on your packaging.
                 </div>
               )}

               <button 
                 onClick={handleVerify}
                 disabled={status === 'checking' || code.length < 5}
                 className="w-full bg-primary text-white py-5 rounded-[30px] font-black text-xl italic uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 {status === 'checking' ? <Loader2 className="animate-spin" /> : <Search size={24} />}
                 Verify Now
               </button>
               
               <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Secure your gear with MobileHub Trust-Link™
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticityVerifier;
