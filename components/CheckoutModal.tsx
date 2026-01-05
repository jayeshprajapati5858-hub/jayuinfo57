
import React, { useState } from 'react';
import { CartItem, Coupon, Order } from '../types';
import { X, CheckCircle, CreditCard, Truck, Loader2, Tag, AlertCircle, MessageCircle, FileText, ArrowLeft, Gift } from 'lucide-react';
import Invoice from './Invoice';
import ScratchCard from './ScratchCard';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onPlaceOrder: (customerDetails: { name: string; address: string; city: string }, discount: number, finalTotal: number) => Order;
  coupons: Coupon[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, onPlaceOrder, coupons }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [revealedCoupon, setRevealedCoupon] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + ((item.price + (item.protectionPlan?.price || 0)) * item.quantity), 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      const order = onPlaceOrder({ name: formData.name, address: formData.address, city: formData.city }, discountAmount, finalTotal);
      setLastOrder(order);
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    if (step === 'success') {
      setStep('form');
      setRevealedCoupon(null);
      setShowInvoice(false);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      
      <div className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full ${showInvoice ? 'max-w-2xl' : 'max-w-4xl'} overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 transition-all`}>
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 z-10">
          <X size={20} />
        </button>

        {step === 'success' ? (
          <div className="flex-1 overflow-y-auto">
            {!showInvoice ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter italic">ORDER PLACED!</h2>
                <p className="text-gray-500 mb-8">Order ID: #{lastOrder?.id.slice(-6).toUpperCase()}</p>

                {/* Scratch & Win Feature */}
                <div className="mb-10 p-6 bg-primary/5 rounded-[40px] border border-primary/10 w-full max-w-sm">
                   <div className="flex items-center justify-center gap-2 text-primary font-black uppercase text-xs tracking-widest mb-4">
                      <Gift size={16} /> YOU WON A REWARD!
                   </div>
                   <ScratchCard onComplete={(code) => setRevealedCoupon(code)} />
                   <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">Scratch the box to reveal your gift</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                   <button onClick={() => setShowInvoice(true)} className="flex items-center justify-center gap-2 p-4 bg-gray-900 text-white rounded-2xl font-bold text-sm">
                      <FileText size={18} /> Invoice
                   </button>
                   <button 
                    onClick={() => {
                        const text = `I just ordered from ${window.location.origin}! Order #${lastOrder?.id.slice(-6)}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-2 p-4 bg-[#25D366] text-white rounded-2xl font-bold text-sm"
                   >
                      <MessageCircle size={18} /> Share
                   </button>
                </div>

                <button onClick={handleClose} className="mt-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-primary transition-colors">Return to Shop</button>
              </div>
            ) : (
              <div className="p-8">
                <button onClick={() => setShowInvoice(false)} className="mb-6 flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary uppercase tracking-widest">
                    <ArrowLeft size={14} /> Back
                </button>
                {lastOrder && <Invoice order={lastOrder} />}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Form and Summary (Existing code remains same, adjusted for protection plan prices) */}
            <div className="flex-1 p-10 bg-white dark:bg-gray-900 overflow-y-auto">
               <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 dark:text-white">Checkout</h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border dark:border-gray-700 dark:text-white outline-none" />
                  <textarea required placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border dark:border-gray-700 dark:text-white outline-none h-24" />
                  <div className="grid grid-cols-2 gap-4">
                     <input required placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border dark:border-gray-700 dark:text-white outline-none" />
                     <input required placeholder="ZIP" className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border dark:border-gray-700 dark:text-white outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-5 rounded-3xl font-black text-xl italic uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                     Confirm Order ₹{finalTotal.toLocaleString()}
                  </button>
               </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
