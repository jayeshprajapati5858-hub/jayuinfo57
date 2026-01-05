
import React, { useState } from 'react';
import { CartItem, Coupon } from '../types';
import { X, CheckCircle, CreditCard, Truck, Loader2, Tag, AlertCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onPlaceOrder: (customerDetails: { name: string; address: string; city: string }, discount: number, finalTotal: number) => void;
  coupons: Coupon[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, onPlaceOrder, coupons }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

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
      setCouponError('Invalid or expired coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate API call and processing delay
    setTimeout(() => {
      setStep('success');
      onPlaceOrder({
        name: formData.name,
        address: formData.address,
        city: formData.city
      }, discountAmount, finalTotal);
    }, 2000);
  };

  const handleClose = () => {
    if (step === 'success') {
      setTimeout(() => {
        setStep('form');
        setFormData({ name: '', email: '', address: '', city: '', zip: '' });
        setAppliedCoupon(null);
        setCouponCode('');
      }, 300);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-10 transition-colors"
        >
          <X size={20} />
        </button>

        {step === 'success' ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Thank you for shopping with MobileHub. Your order has been confirmed and will be shipped to <span className="font-semibold text-gray-700">{formData.city}</span> shortly.
            </p>
            <button 
              onClick={handleClose}
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left: Order Summary */}
            <div className="w-full md:w-1/3 bg-gray-50 p-6 md:p-8 border-r border-gray-100 overflow-y-auto order-2 md:order-1">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Coupon Section */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Discount Code</label>
                
                {appliedCoupon ? (
                  // Applied State
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 group">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <Tag size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-900 tracking-wide">{appliedCoupon.code}</span>
                          <span className="text-[10px] bg-green-200 text-green-800 px-1.5 py-0.5 rounded font-bold">-{appliedCoupon.discountPercent}%</span>
                        </div>
                        <p className="text-xs text-green-700 font-medium mt-0.5">
                          You saved <span className="font-bold">₹{discountAmount.toLocaleString()}</span>!
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleRemoveCoupon}
                      className="p-2 hover:bg-green-100 rounded-full text-green-600/60 hover:text-red-500 transition-colors"
                      title="Remove Coupon"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  // Input State
                  <div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={e => {
                          setCouponCode(e.target.value);
                          setCouponError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter Code"
                        className={`flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 transition-all uppercase ${
                          couponError 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-900 placeholder:text-red-300' 
                            : 'border-gray-300 focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        type="button"
                        disabled={!couponCode.trim()}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <div className="mt-2 text-red-500 text-xs font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
                        <AlertCircle size={12} /> {couponError}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                   <div className="flex justify-between text-sm text-green-600 font-bold bg-green-50 p-2 rounded-lg -mx-2">
                    <span className="flex items-center gap-1"><Tag size={12}/> Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 mt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right: Checkout Form */}
            <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto order-1 md:order-2">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-gray-900">Shipping Details</h2>
                 <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded">SECURE</span>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Shipping Address</label>
                  <textarea 
                    required
                    rows={2}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    placeholder="123 Main St, Apartment 4B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input 
                      required
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                    <input 
                      required
                      type="text"
                      pattern="[0-9]*"
                      value={formData.zip}
                      onChange={e => setFormData({...formData, zip: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="400001"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border border-primary bg-blue-50/50 rounded-xl cursor-pointer ring-1 ring-primary transition-all">
                      <input type="radio" name="payment" defaultChecked className="text-primary accent-primary" />
                      <Truck className="text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when you receive</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-not-allowed opacity-60 bg-gray-50">
                      <input type="radio" name="payment" disabled className="text-gray-400" />
                      <CreditCard className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-400">Online Payment</p>
                        <p className="text-xs text-gray-400">Temporarily unavailable</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={step === 'processing'}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                >
                  {step === 'processing' ? (
                    <>
                      <Loader2 className="animate-spin" /> Processing Order...
                    </>
                  ) : (
                    <>
                      Confirm Order • ₹{finalTotal.toLocaleString()}
                    </>
                  )}
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
