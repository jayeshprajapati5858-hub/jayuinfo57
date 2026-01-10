import React, { useState } from 'react';
import { X, Loader2, AlertCircle, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { auth } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onSignup: (user: User) => Promise<boolean>;
  users: User[];
  onResetPassword?: () => Promise<boolean>;
}

const UserAuthModal: React.FC<UserAuthModalProps> = ({ isOpen, onClose, onLogin, onSignup, users }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if user exists in our DB by email or UID
      const existingUser = users.find(u => u.email === firebaseUser.email || u.id === firebaseUser.uid);
      
      if (existingUser) {
        onLogin(existingUser);
        onClose();
      } else {
        // Create new user profile from Google data
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || undefined,
          phoneNumber: firebaseUser.phoneNumber || undefined,
          joinDate: new Date().toISOString()
        };
        
        // Call parent signup handler (which saves to Firestore)
        const success = await onSignup(newUser);
        if (success) {
          onLogin(newUser);
          onClose();
        } else {
          setError("Failed to create account profile.");
        }
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
          setError("Sign-in cancelled.");
      } else if (err.code === 'auth/unauthorized-domain') {
          setError(`Domain error. Please use "Guest Login" below for now.`);
      } else {
          setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    onLogin({
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: '',
      phoneNumber: '',
      joinDate: new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors z-20">
          <X size={20} />
        </button>

        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white">
              Welcome
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Join MobileHub to track orders & get offers
            </p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm relative overflow-hidden group"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin text-primary" />
            ) : (
              <>
                 <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                    <path fill="#EA4335" d="M12 4.36c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                 </svg>
                 <span className="text-lg">Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-4 w-full my-6">
            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">OR</span>
            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></div>
          </div>

          <button 
            onClick={handleGuestLogin}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <UserIcon size={20} /> Continue as Guest
          </button>

          {error && (
             <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30 mt-6 animate-in slide-in-from-top-2 w-full">
                <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400 text-xs font-bold leading-tight text-left">{error}</p>
             </div>
          )}

          <div className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
             Secure Authentication by Google
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserAuthModal;