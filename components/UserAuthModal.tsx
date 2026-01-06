
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onSignup: (user: User) => void;
  existingUsers: User[];
}

const UserAuthModal: React.FC<UserAuthModalProps> = ({ isOpen, onClose, onLogin, onSignup, existingUsers }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (mode === 'login') {
        const user = existingUsers.find(u => u.email === formData.email && u.password === formData.password);
        if (user) {
          onLogin(user);
          onClose();
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        const exists = existingUsers.find(u => u.email === formData.email);
        if (exists) {
          setError('An account with this email already exists.');
        } else {
          const newUser: User = {
            id: `user-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            joinDate: new Date().toISOString()
          };
          onSignup(newUser);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setMode('login');
          }, 1500);
        }
      }
      setLoading(false);
    }, 1000);
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
              <h3 className="text-xl font-bold dark:text-white">Account Created!</h3>
              <p className="text-gray-500">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required 
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary rounded-xl outline-none dark:text-white transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                <p className="text-red-500 text-xs font-bold text-center animate-in shake-1 tracking-tight">
                  {error}
                </p>
              )}

              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
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
