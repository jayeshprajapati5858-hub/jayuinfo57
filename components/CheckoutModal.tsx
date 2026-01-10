
import React, { useState, useEffect, useRef } from 'react';
import { CartItem, Coupon, Order, User } from '../types';
import { X, CheckCircle, ArrowLeft, Gift, Smartphone, MessageCircle, MapPin, ShoppingBag, ChevronRight, CreditCard, ShieldCheck, Loader2, QrCode, Upload } from 'lucide-react';
import { SHOP_NAME } from '../constants';
import Invoice from './Invoice';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onPlaceOrder: (customerDetails: { name: string; address: string; city: string }, discount: number, finalTotal: number, paymentMethod: 'COD' | 'UPI', paymentScreenshot?: string) => Order;
  coupons: Coupon[];
  currentUser: User | null;
}

type CheckoutStep = 'summary' | 'address' | 'payment' | 'processing' | 'success';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, onPlaceOrder, coupons, currentUser }) => {
  const [step, setStep] = useState<CheckoutStep>('summary');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', city: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  // Screenshot State
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phoneNumber || prev.phone,
        email: currentUser.email || prev.email,
        // Pre-fill address if available
        address: currentUser.addresses && currentUser.addresses.length > 0 ? currentUser.addresses[0].details : prev.address,
        city: currentUser.addresses && currentUser.addresses.length > 0 ? currentUser.addresses[0].city : prev.city,
        zip: currentUser.addresses && currentUser.addresses.length > 0 ? currentUser.addresses[0].zip : prev.zip
      }));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

  const handleProceedToAddress = () => {
    if (cartItems.length === 0) return;
    setStep('address');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
      e.preventDefault();
      setStep('payment');
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'UPI' && !paymentScreenshot) {
        alert("Please upload the payment screenshot to confirm your order.");
        return;
    }

    setStep('processing');
    setTimeout(() => {
      const fullAddress = `${formData.address}, ${formData.city} - ${formData.zip}. (Phone: ${formData.phone})`;
      const order = onPlaceOrder(
          { name: formData.name, address: fullAddress, city: formData.city }, 
          discountAmount, 
          finalTotal,
          paymentMethod,
          paymentScreenshot || undefined
      );
      setLastOrder(order);
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const handleClose = () => {
    setStep('summary');
    setShowInvoice(false);
    if (!currentUser) {
        setFormData({ name: '', phone: '', email: '', address: '', city: '', zip: '' });
    }
    setAppliedCoupon(null);
    setCouponCode('');
    setPaymentMethod('COD');
    setPaymentScreenshot(null);
    onClose();
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-black overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="min-h-screen flex flex-col">
          <div className="bg-white dark:bg-gray-900 p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-2">
               <div className="bg-green-500 p-1.5 rounded-lg text-white"><CheckCircle size={20} /></div>
               <span className="font-bold text-lg dark:text-white">Order Confirmed</span>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
             {!showInvoice ? (
               <div className="flex flex-col items-center text-center space-y-8 py-8">
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-2">Thank You!</h2>
                    <p className="text-gray-500">Order #{lastOrder?.id.slice(-6).toUpperCase()} has been placed successfully.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-8">
                     <button onClick={() => setShowInvoice(true)} className="flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-2xl font-bold hover:scale-105 transition-transform">
                        <Smartphone size={18} /> View Invoice
                     </button>
                     <button onClick={handleClose} className="py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/30">
                        Continue Shopping
                     </button>
                  </div>
               </div>
             ) : (
               <div className="animate-in zoom-in-95">
                  <button onClick={() => setShowInvoice(false)} className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary">
                      <ArrowLeft size={16} /> Back to Order
                  </button>
                  {lastOrder && <Invoice order={lastOrder} />}
               </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col items-center justify-center">
         <Loader2 size={64} className="text-primary animate-spin mb-6" />
         <h2 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">Processing Order</h2>
         <p className="text-gray-500 mt-2">Please wait while we confirm your details...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-black overflow-y-auto animate-in slide-in-from-bottom duration-300">
      <div className="min-h-screen flex flex-col">
        
        <div className="bg-white dark:bg-gray-900 sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800 shadow-sm">
           <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button onClick={() => {
                     if (step === 'payment') setStep('address');
                     else if (step === 'address') setStep('summary');
                     else handleClose();
                 }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    {step !== 'summary' ? <ArrowLeft size={20} className="dark:text-white"/> : <X size={20} className="dark:text-white"/>}
                 </button>
                 <div>
                    <h1 className="text-lg font-bold dark:text-white leading-none">Checkout</h1>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                       Step {step === 'summary' ? 1 : step === 'address' ? 2 : 3} of 3
                    </p>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
           
           {/* STEP 1: SUMMARY */}
           {step === 'summary' && (
             <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                   <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="text-primary" /> Your Cart Items
                   </h2>
                   <div className="space-y-6">
                      {cartItems.map((item) => (
                         <div key={`${item.id}-${item.selectedColor}`} className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                               <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                               <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                               {item.selectedColor && <p className="text-[10px] font-bold text-gray-500 uppercase">Color: {item.selectedColor}</p>}
                               <div className="flex justify-between items-center mt-2">
                                  <span className="text-sm font-semibold dark:text-gray-300">Qty: {item.quantity}</span>
                                  <span className="font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</span>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Gift size={18} className="text-pink-500" /> Apply Coupon
                   </h3>
                   <div className="flex gap-2">
                      <input type="text" placeholder="Enter Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 uppercase font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                      <button onClick={handleApplyCoupon} className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold">Apply</button>
                   </div>
                   {appliedCoupon && <div className="mt-3 text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle size={14} /> Coupon '{appliedCoupon.code}' Applied!</div>}
                   {couponError && <p className="mt-2 text-red-500 text-xs font-bold">{couponError}</p>}
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-24 md:mb-6">
                   <div className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-green-600"><span>Discount</span><span>- ₹{discountAmount.toLocaleString()}</span></div>
                      <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Shipping</span><span className="text-green-600 font-bold uppercase text-xs">Free</span></div>
                   </div>
                   <div className="flex justify-between items-center pt-4">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">Total Amount</span>
                      <span className="text-2xl font-black text-primary">₹{finalTotal.toLocaleString()}</span>
                   </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 md:relative md:bg-transparent md:border-none md:p-0">
                   <button onClick={handleProceedToAddress} className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">Add Address <ChevronRight size={20} /></button>
                </div>
             </div>
           )}

           {/* STEP 2: ADDRESS */}
           {step === 'address' && (
             <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                   <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 dark:text-white flex items-center gap-2"><MapPin className="text-primary" /> Delivery Details</h2>
                   <form onSubmit={handleProceedToPayment} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-primary outline-none dark:text-white transition-all font-medium" placeholder="Enter your name" /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Phone Number</label><input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-primary outline-none dark:text-white transition-all font-medium" placeholder="10 digit mobile number" /></div>
                      </div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email (Optional)</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-primary outline-none dark:text-white transition-all font-medium" /></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Address</label><textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-primary outline-none dark:text-white transition-all font-medium h-32 resize-none" placeholder="House No, Street..." /></div>
                      <div className="grid grid-cols-2 gap-5">
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">City</label><input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-primary outline-none dark:text-white transition-all font-medium" /></div>
                         <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Pincode</label><input required maxLength={6} value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value.replace(/\D/g,'')})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-primary outline-none dark:text-white transition-all font-medium" /></div>
                      </div>
                      <div className="pt-6">
                         <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">Proceed to Payment</button>
                      </div>
                   </form>
                </div>
             </div>
           )}

           {/* STEP 3: PAYMENT */}
           {step === 'payment' && (
             <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 dark:text-white flex items-center gap-2"><CreditCard className="text-primary" /> Select Payment</h2>
                    
                    <div className="space-y-4 mb-8">
                        <div onClick={() => setPaymentMethod('UPI')} className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'UPI' ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-primary' : 'border-gray-300'}`}>
                                {paymentMethod === 'UPI' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white">UPI / QR Code</h3>
                                <p className="text-xs text-gray-500">Pay via GPay, PhonePe, Paytm</p>
                            </div>
                            <QrCode size={24} className="text-gray-400" />
                        </div>

                        <div onClick={() => setPaymentMethod('COD')} className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-gray-300'}`}>
                                {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white">Cash on Delivery</h3>
                                <p className="text-xs text-gray-500">Pay when you receive the order</p>
                            </div>
                            <Smartphone size={24} className="text-gray-400" />
                        </div>
                    </div>

                    {paymentMethod === 'UPI' && (
                        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl flex flex-col items-center text-center animate-in zoom-in-95">
                            <p className="font-bold text-gray-900 dark:text-white mb-4">Scan to Pay ₹{finalTotal}</p>
                            <div className="bg-white p-2 rounded-xl shadow-sm mb-4">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=gpay-11241690646@okbizaxis&pn=MobileHub&am=${finalTotal}&cu=INR`} alt="Payment QR" className="w-40 h-40" />
                            </div>
                            
                            <div className="w-full max-w-xs mt-4">
                               <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Upload Payment Screenshot</p>
                               <div 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center bg-white dark:bg-gray-900"
                               >
                                  {paymentScreenshot ? (
                                      <div className="relative w-full">
                                         <img src={paymentScreenshot} alt="Payment Proof" className="max-h-32 mx-auto rounded-lg" />
                                         <span className="text-[10px] text-green-500 font-bold block mt-2">Screenshot Attached!</span>
                                      </div>
                                  ) : (
                                      <>
                                          <Upload size={24} className="text-gray-400 mb-2" />
                                          <span className="text-xs text-gray-500">Click to upload screenshot</span>
                                      </>
                                  )}
                                  <input type="file" ref={fileInputRef} onChange={handleScreenshotUpload} className="hidden" accept="image/*" />
                               </div>
                            </div>
                        </div>
                    )}

                    <button onClick={handlePlaceOrder} className="w-full bg-gray-900 dark:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                        <ShieldCheck size={20} /> {paymentMethod === 'UPI' ? 'Payment Done & Confirm' : 'Place Order'}
                    </button>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
