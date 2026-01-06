
import React, { useState } from 'react';
import { CartItem, Coupon, Order } from '../types';
import { X, CheckCircle, CreditCard, Truck, Loader2, Tag, ArrowLeft, Gift, Smartphone, Mail, MapPin, Wallet, Banknote, RotateCcw, ShieldCheck } from 'lucide-react';
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
  
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', city: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + ((item.price + (item.protectionPlan?.price || 0)) * item.quantity), 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    
    const coupon = coupons.find(c => c.code === code && c.isActive);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Invalid coupon code');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      const fullAddress = `${formData.address}, ${formData.city} - ${formData.zip}. (Phone: ${formData.phone})`;
      const order = onPlaceOrder({ name: formData.name, address: fullAddress, city: formData.city }, discountAmount, finalTotal);
      setLastOrder(order);
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    if (step === 'success') {
      setStep('form');
      setShowInvoice(false);
      setFormData({ name: '', phone: '', email: '', address: '', city: '', zip: '' });
      setAppliedCoupon(null);
      setCouponCode('');
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      
      <div className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full ${showInvoice ? 'max-w-2xl' : 'max-w-5xl'} overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 transition-all`}>
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 z-20 text-gray-500">
          <X size={20} />
        </button>

        {step === 'success' ? (
          <div className="flex-1 overflow-y-auto">
            {!showInvoice ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter italic">ORDER PLACED!</h2>
                <p className="text-gray-500 mb-8">Order ID: #{lastOrder?.id.slice(-6).toUpperCase()}</p>

                <div className="mb-10 p-6 bg-primary/5 rounded-[40px] border border-primary/10 w-full max-w-sm">
                   <div className="flex items-center justify-center gap-2 text-primary font-black uppercase text-xs tracking-widest mb-4">
                      <Gift size={16} /> YOU WON A REWARD!
                   </div>
                   <ScratchCard onComplete={() => {}} />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                   <button onClick={() => setShowInvoice(true)} className="flex items-center justify-center gap-2 p-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-colors">
                      <Invoice size={18} /> Invoice
                   </button>
                   <button onClick={handleClose} className="p-4 bg-primary text-white rounded-2xl font-bold text-sm">Continue Shop</button>
                </div>
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
        ) : step === 'processing' ? (
            <div className="flex flex-col items-center justify-center h-full p-12">
                <Loader2 size={48} className="text-primary animate-spin mb-4" />
                <h3 className="text-xl font-bold dark:text-white">Processing Order...</h3>
            </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-5/12 bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 overflow-y-auto border-r border-gray-100 dark:border-gray-800 hidden md:block">
                <h3 className="text-lg font-black uppercase italic tracking-wider mb-6 dark:text-white flex items-center gap-2">
                    <Tag size={18} className="text-primary" /> Order Summary
                </h3>
                
                {/* 7 Days Banner in Checkout */}
                <div className="mb-6 bg-green-500/10 border border-green-500/20 p-3 rounded-2xl flex items-center gap-3">
                    <RotateCcw size={16} className="text-green-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-700">7 Days Return Guaranteed</span>
                </div>

                <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-black text-gray-900 dark:text-white pt-2">
                        <span>Total</span>
                        <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase mt-4">
                        <ShieldCheck size={12} /> Secure Checkout Protected
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 md:p-10 bg-white dark:bg-gray-900 overflow-y-auto">
               <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 dark:text-white">Shipping Details</h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none" />
                    <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none" />
                  </div>
                  <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none" />
                  <textarea required placeholder="Full Delivery Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none h-20" />
                  <div className="grid grid-cols-2 gap-4">
                     <input required placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none" />
                     <input required placeholder="Pincode" maxLength={6} value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value.replace(/\D/g,'')})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg italic uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all mt-6 flex items-center justify-center gap-2">
                     <CheckCircle size={20} /> Confirm Order
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
