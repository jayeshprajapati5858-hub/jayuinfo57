
import React from 'react';
import { Order } from '../types';
import { Smartphone, Download, Share2 } from 'lucide-react';
import { SHOP_NAME } from '../constants';

interface InvoiceProps {
  order: Order;
}

const Invoice: React.FC<InvoiceProps> = ({ order }) => {
  const handlePrint = () => {
    window.print();
  };

  const shareOnWhatsApp = () => {
    const text = `*Order Confirmation - ${SHOP_NAME}*\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nTotal: ₹${order.finalTotal || order.total}\n\nThank you for shopping with us!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:border-none">
      <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Smartphone size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase">{SHOP_NAME}</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Official Invoice</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Order ID</p>
          <p className="font-mono text-sm">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Billed To</p>
            <p className="font-bold text-gray-900 dark:text-white">{order.customerName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{order.address}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Order Date</p>
            <p className="font-medium text-gray-900 dark:text-white">{new Date(order.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left py-4 text-xs font-bold text-gray-400 uppercase">Description</th>
              <th className="text-center py-4 text-xs font-bold text-gray-400 uppercase">Qty</th>
              <th className="text-right py-4 text-xs font-bold text-gray-400 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-4">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">₹{item.price.toLocaleString()} per unit</p>
                </td>
                <td className="py-4 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</td>
                <td className="py-4 text-right font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-gray-900 dark:text-white">₹{order.total.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="font-medium">Coupon Discount</span>
              <span className="font-bold">-₹{order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
          </div>
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount</span>
            <span className="text-2xl font-black text-primary">₹{(order.finalTotal || order.total).toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-3 print:hidden">
          <button onClick={handlePrint} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
            <Download size={18} /> Download PDF
          </button>
          <button onClick={shareOnWhatsApp} className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <Share2 size={18} /> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
