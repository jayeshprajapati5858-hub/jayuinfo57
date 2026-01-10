
import React, { useState } from 'react';
import { X, Lock, ArrowRight, Database, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { PRODUCTS } from '../constants';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated Password as per request
    if (password === 'Jayesh@15194$') {
      onLogin();
      onClose();
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleSeedDatabase = async () => {
    setSeedingStatus('loading');
    const success = await api.seedProducts(PRODUCTS);
    if (success) {
      setSeedingStatus('success');
      // Reset status after 3 seconds
      setTimeout(() => setSeedingStatus('idle'), 3000);
    } else {
      setSeedingStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-200">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
          <p className="text-gray-500 mt-2">Enter secure password to manage store.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter Password"
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-200'} focus:ring-4 focus:border-gray-900 outline-none transition-all text-center text-lg tracking-widest placeholder:tracking-normal`}
            />
            {error && (
              <p className="text-red-500 text-sm text-center font-medium animate-in slide-in-from-top-1">
                Incorrect password. Access Denied.
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Access Dashboard <ArrowRight size={18} />
          </button>
        </form>

        {/* Database Repair Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400 mb-3 uppercase font-bold tracking-widest">Troubleshooting</p>
          <button 
            onClick={handleSeedDatabase}
            disabled={seedingStatus === 'loading'}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              seedingStatus === 'success' ? 'bg-green-100 text-green-700' : 
              seedingStatus === 'error' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {seedingStatus === 'loading' ? (
              <><RefreshCw size={14} className="animate-spin" /> Initializing DB...</>
            ) : seedingStatus === 'success' ? (
              <><CheckCircle size={14} /> Database Connected!</>
            ) : seedingStatus === 'error' ? (
              <><AlertTriangle size={14} /> Failed (Check Console)</>
            ) : (
              <><Database size={14} /> Initialize / Repair Database</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
