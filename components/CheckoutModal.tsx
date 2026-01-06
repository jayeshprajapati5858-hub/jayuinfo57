
import React, { useState } from 'react';
import { CartItem, Coupon, Order } from '../types';
import { X, CheckCircle, CreditCard, Truck, Loader2, Tag, AlertCircle, MessageCircle, FileText, ArrowLeft, Gift, Smartphone, Mail, MapPin, Wallet, Banknote } from 'lucide-react';
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
  
  // Enhanced Form Data
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
      // Combine address details
      const fullAddress = `${formData.address}, ${formData.city} - ${formData.zip}. (Phone: ${formData.phone})`;
      
      const order = onPlaceOrder({ name: formData.name, address: fullAddress, city: formData.city }, discountAmount, finalTotal);
      setLastOrder(order);
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    if (step === 'success') {
      setStep('form');
      setRevealedCoupon(null);
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

                {/* Scratch & Win Feature */}
                <div className="mb-10 p-6 bg-primary/5 rounded-[40px] border border-primary/10 w-full max-w-sm">
                   <div className="flex items-center justify-center gap-2 text-primary font-black uppercase text-xs tracking-widest mb-4">
                      <Gift size={16} /> YOU WON A REWARD!
                   </div>
                   <ScratchCard onComplete={(code) => setRevealedCoupon(code)} />
                   <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">Scratch the box to reveal your gift</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                   <button onClick={() => setShowInvoice(true)} className="flex items-center justify-center gap-2 p-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-colors">
                      <FileText size={18} /> Invoice
                   </button>
                   <button 
                    onClick={() => {
                        const text = `I just ordered from MobileHub! Order #${lastOrder?.id.slice(-6)}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-2 p-4 bg-[#25D366] text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity"
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
        ) : step === 'processing' ? (
            <div className="flex flex-col items-center justify-center h-full p-12">
                <Loader2 size={48} className="text-primary animate-spin mb-4" />
                <h3 className="text-xl font-bold dark:text-white">Processing Order...</h3>
                <p className="text-gray-500">Please wait while we confirm your details.</p>
            </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            
            {/* Left: Order Summary (Visible on Desktop) */}
            <div className="w-full md:w-5/12 bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 overflow-y-auto border-r border-gray-100 dark:border-gray-800 hidden md:block">
                <h3 className="text-lg font-black uppercase italic tracking-wider mb-6 dark:text-white flex items-center gap-2">
                    <Tag size={18} className="text-primary" /> Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                                {item.protectionPlan && (
                                    <div className="flex items-center gap-1 text-[10px] text-green-600 mt-1">
                                        <CheckCircle size={10} /> + {item.protectionPlan.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {/* Coupon Input */}
                    <div className="py-2">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Coupon Code" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none uppercase dark:text-white"
                            />
                            <button 
                                onClick={handleApplyCoupon}
                                className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors"
                            >
                                APPLY
                            </button>
                        </div>
                        {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                        {appliedCoupon && (
                            <div className="flex justify-between text-sm text-green-600 mt-2 font-medium bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                                <span className="flex items-center gap-1"><Tag size={14}/> Coupon ({appliedCoupon.code})</span>
                                <span>-₹{discountAmount.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Shipping</span>
                        <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-black text-gray-900 dark:text-white pt-2">
                        <span>Total</span>
                        <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 p-6 md:p-10 bg-white dark:bg-gray-900 overflow-y-auto">
               <div className="md:hidden mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                   <div className="flex justify-between items-center">
                       <h2 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">Checkout</h2>
                       <div className="text-right">
                           <p className="text-xs text-gray-500">Total Amount</p>
                           <p className="text-xl font-bold text-primary">₹{finalTotal.toLocaleString()}</p>
                       </div>
                   </div>
               </div>

               <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 dark:text-white hidden md:block">Shipping Details</h2>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Info */}
                  <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                          <Smartphone size={16} /> Contact Info
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 ml-1">Full Name</label>
                            <input required placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 ml-1">Phone Number</label>
                            <input required type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none transition-all" />
                        </div>
                      </div>
                      <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 ml-1">Email Address</label>
                            <input required type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none transition-all" />
                      </div>
                  </div>

                  {/* Address Info */}
                  <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                          <MapPin size={16} /> Delivery Address
                      </h3>
                      <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500 ml-1">Street Address</label>
                          <textarea required placeholder="House No, Street Name, Area" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none transition-all h-20 resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 ml-1">City</label>
                            <input required placeholder="Ahmedabad" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none transition-all" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 ml-1">Pincode</label>
                            <input required placeholder="380001" maxLength={6} value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value.replace(/\D/g,'')})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-900 dark:text-white outline-none transition-all" />
                         </div>
                      </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                          <Wallet size={16} /> Payment Method
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                          <button type="button" onClick={() => setPaymentMethod('cod')} className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-500'}`}>
                              <Banknote size={24} />
                              <span className="text-[10px] font-bold">Cash on Delivery</span>
                          </button>
                          <button type="button" onClick={() => setPaymentMethod('upi')} className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-500'}`}>
                              <Smartphone size={24} />
                              <span className="text-[10px] font-bold">UPI / GPay</span>
                          </button>
                          <button type="button" onClick={() => setPaymentMethod('card')} className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-500'}`}>
                              <CreditCard size={24} />
                              <span className="text-[10px] font-bold">Card</span>
                          </button>
                      </div>
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
