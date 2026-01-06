
import React from 'react';
import { Order } from '../types';
import { X, Package, Truck, XCircle, Clock, ShieldCheck } from 'lucide-react';

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-primary" /> My Orders
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            orders.slice().reverse().map(order => (
              <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">Order #{order.id.slice(-6)}</p>
                    <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Shipped' ? 'bg-green-100 text-green-700' :
                    order.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'Shipped' ? <Truck size={12} /> : 
                     order.status === 'Rejected' ? <XCircle size={12} /> : 
                     <Clock size={12} />}
                    {order.status}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Total Amount</span>
                      <span className="font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                  </div>
                  {order.verificationCode && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-dashed border-gray-300">
                        <ShieldCheck size={14} className="text-primary"/>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Code:</span>
                        <span className="text-xs font-mono font-bold text-gray-900">{order.verificationCode}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
