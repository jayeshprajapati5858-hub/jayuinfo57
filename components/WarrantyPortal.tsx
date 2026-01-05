
import React, { useState } from 'react';
import { ShieldCheck, X, CheckCircle, Search } from 'lucide-react';

interface WarrantyPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WarrantyPortal: React.FC<WarrantyPortalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({ orderId: '', serialNo: '', name: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>

          {step === 'form' ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Warranty Registration</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Secure your purchase in seconds</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20" placeholder="Enter your name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order ID</label>
                    <input required type="text" value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20" placeholder="#MH-1234" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serial Number</label>
                    <input required type="text" value={formData.serialNo} onChange={e => setFormData({...formData, serialNo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20" placeholder="S/N: 987..." />
                  </div>
                </div>
                <button type="submit" className="w-full bg-gray-900 dark:bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Register Warranty
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Complete!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Your product is now covered under MobileHub Official Warranty for 1 Year.</p>
              <button onClick={onClose} className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-xl font-bold">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyPortal;
