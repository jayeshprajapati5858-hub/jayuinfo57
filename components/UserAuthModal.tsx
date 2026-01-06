
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { email: string, password: string }) => Promise<boolean>;
  onSignup: (user: User) => Promise<boolean>;
}

const UserAuthModal: React.FC<UserAuthModalProps> = ({ isOpen, onClose, onLogin, onSignup }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const success = await onLogin({ email: formData.email, password: formData.password });
        if (success) {
          onClose();
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          joinDate: new Date().toISOString()
        };
        const success = await onSignup(newUser);
        if (success) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setMode('login');
            setFormData(prev => ({ ...prev, password: '' })); // Clear password for login
          }, 2000);
        } else {
          setError('Could not create account. Email might already exist.');
        }
      }
    } catch (err) {
      setError('Connection error. Please check if the server is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors z-20">
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {mode === 'login' ? 'Login to track your orders and earn coins.' : 'Join MobileHub and get 10% OFF on your first order!'}
            </p>
          </div>

          {success ? (
            <div className="text-center py-10 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold dark:text-white uppercase">Success!</h3>
              <p className="text-gray-500 text-sm">Account created on server. Switching to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    required 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary rounded-xl outline-none dark:text-white transition-all"
                  />
                </div>
              )}
              
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  required 
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary rounded-xl outline-none dark:text-white transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  required 
                  type="password" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary rounded-xl outline-none dark:text-white transition-all"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold text-center animate-in shake-1 tracking-tight bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">
                  {error}
                </p>
              )}

              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><ArrowRight size={20} /> {mode === 'login' ? 'Login' : 'Signup'}</>}
              </button>

              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-xs font-bold text-gray-500 hover:text-primary transition-colors"
                >
                  {mode === 'login' ? "Don't have an account? Create one" : "Already have an account? Login"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAuthModal;
