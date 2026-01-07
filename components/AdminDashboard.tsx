
import React, { useState, useEffect } from 'react';
import { Product, Order, Category, Coupon, Review, User } from '../types';
import { Plus, Package, Check, X, ArrowLeft, Printer, Trash2, Tag, Image as ImageIcon, Loader2, Star, MessageSquare, Users, Mail, Lock, Calendar, Settings, Server, Globe, Save } from 'lucide-react';
import { SHOP_NAME } from '../constants';
import { api } from '../services/api';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  users: User[];
  serverStatus?: 'online' | 'offline' | 'checking';
  onUpdateOrderStatus: (orderId: string, status: 'Shipped' | 'Rejected') => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  onAddReview?: (productId: string, review: Review) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, 
  products, 
  coupons,
  users,
  serverStatus = 'online',
  onUpdateOrderStatus, 
  onAddProduct, 
  onDeleteProduct,
  onUpdateStock,
  onAddCoupon,
  onDeleteCoupon,
  onAddReview,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons' | 'users' | 'settings'>('orders');
  const [isUploading, setIsUploading] = useState(false);
  
  // Settings State
  const [apiUrl, setApiUrl] = useState('');
  
  useEffect(() => {
    setApiUrl(api.getCurrentUrl());
  }, []);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: Category.COVER,
    description: '',
    image: '',
    stock: 50,
    sales: 0
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '', image: '' });
  const [reviewImageFile, setReviewImageFile] = useState<File | null>(null);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercent: 10 });

  const totalEarnings = orders
    .filter(o => o.status !== 'Rejected')
    .reduce((sum, order) => sum + (order.finalTotal || order.total), 0);

  const handleFileToUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let imageUrl = newProduct.image;
    if (imageFile) {
      try { imageUrl = await handleFileToUrl(imageFile); } 
      catch { imageUrl = `https://picsum.photos/400/400?random=${Date.now()}`; }
    } else if (!imageUrl) {
        imageUrl = `https://picsum.photos/400/400?random=${Date.now()}`;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: imageUrl,
      rating: 0,
      stock: Number(newProduct.stock),
      sales: 0,
      reviews: []
    };

    onAddProduct(product);
    setNewProduct({ name: '', price: '', category: Category.COVER, description: '', image: '', stock: 50, sales: 0 });
    setImageFile(null);
    setIsUploading(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reviewModalOpen || !onAddReview) return;

      setIsUploading(true);
      let reviewImg = '';
      if (reviewImageFile) {
          try { reviewImg = await handleFileToUrl(reviewImageFile); } catch {}
      }

      const review: Review = {
          id: Date.now().toString(),
          userName: newReview.userName,
          rating: Number(newReview.rating),
          comment: newReview.comment,
          date: new Date().toISOString().split('T')[0],
          image: reviewImg || undefined
      };

      onAddReview(reviewModalOpen, review);
      setReviewModalOpen(null);
      setNewReview({ userName: '', rating: 5, comment: '', image: '' });
      setReviewImageFile(null);
      setIsUploading(false);
  };

  const handleProductImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleReviewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) setReviewImageFile(e.target.files[0]);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newCoupon.code) return;
    onAddCoupon({ code: newCoupon.code.toUpperCase(), discountPercent: Number(newCoupon.discountPercent), isActive: true });
    setNewCoupon({ code: '', discountPercent: 10 });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    api.setApiUrl(apiUrl);
  };

  const handlePrintOrder = (order: Order) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
     const htmlContent = `
      <html>
        <head>
          <title>Order #${order.id} - Invoice</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #eee; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">${SHOP_NAME} Invoice</div>
            <div>Order #${order.id.slice(-6)}</div>
          </div>
          <p><strong>To:</strong> ${order.customerName}<br/>${order.address}</p>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>
              ${order.items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${item.quantity * item.price}</td></tr>`).join('')}
            </tbody>
          </table>
          <h3>Total: ₹${(order.finalTotal || order.total).toLocaleString()}</h3>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-950 overflow-y-auto">
      <div className="bg-gray-900 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold flex-1 md:flex-none">Admin Panel</h1>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${serverStatus === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
               <Server size={14} />
               {serverStatus === 'online' ? 'Server Connected' : 'Offline Mode'}
            </div>
            <div className="flex gap-4 md:gap-8">
              <div className="text-center md:text-right">
                <p className="text-[10px] md:text-xs text-gray-400">Earnings</p>
                <p className="font-bold text-green-400 text-sm md:text-base">₹{totalEarnings.toLocaleString()}</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[10px] md:text-xs text-gray-400">Users</p>
                <p className="font-bold text-white text-sm md:text-base">{users.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 md:gap-4 mb-4 scrollbar-hide">
          <button onClick={() => setActiveTab('orders')} className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            <Package size={18} /> Orders
          </button>
          <button onClick={() => setActiveTab('products')} className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'products' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            <Plus size={18} /> Products
          </button>
          <button onClick={() => setActiveTab('coupons')} className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'coupons' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            <Tag size={18} /> Coupons
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'users' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            <Users size={18} /> Users
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            <Settings size={18} /> Settings
          </button>
        </div>

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Globe size={24} className="text-gray-900 dark:text-white" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connection Settings</h2>
                    <p className="text-sm text-gray-500">Manage how the app connects to your VPS server.</p>
                 </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Backend API URL</label>
                    <div className="flex gap-2">
                       <input 
                         type="url" 
                         value={apiUrl} 
                         onChange={(e) => setApiUrl(e.target.value)} 
                         placeholder="http://152.53.240.143:5000/api"
                         className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                       />
                       <button type="submit" className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors">
                          <Save size={18} /> Save
                       </button>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                       <strong>Current Status:</strong> {serverStatus === 'online' ? <span className="text-green-600 font-bold">Connected</span> : <span className="text-red-500 font-bold">Disconnected</span>}
                       <br/><br/>
                       <strong>Note for Vercel/Production:</strong> If your website is on Vercel (HTTPS), you must use an HTTPS URL here (e.g., <code>https://api.yourdomain.com</code>). Vercel blocks connections to HTTP IPs (Mixed Content).
                       <br/>
                       <strong>Note for Local/VPS:</strong> You can use <code>http://152.53.240.143:5000/api</code> if you are testing locally or if you disable security in browser.
                    </p>
                 </div>
              </form>
           </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 font-mono text-sm text-gray-500">#{order.id.slice(0,6)}</td>
                        <td className="p-4">
                            <div className="font-medium dark:text-white">{order.customerName}</div>
                            <div className="text-xs text-gray-400">{order.address}</div>
                        </td>
                        <td className="p-4 text-sm dark:text-gray-300">{order.items.length} Items</td>
                        <td className="p-4 font-bold dark:text-white">₹{(order.finalTotal||order.total).toLocaleString()}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${order.status === 'Shipped' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{order.status}</span></td>
                        <td className="p-4 flex gap-2">
                            <button onClick={() => handlePrintOrder(order)} className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition-colors"><Printer size={16}/></button>
                            {order.status === 'Pending' && (
                                <>
                                <button onClick={() => onUpdateOrderStatus(order.id, 'Shipped')} className="p-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded transition-colors"><Check size={16}/></button>
                                <button onClick={() => onUpdateOrderStatus(order.id, 'Rejected')} className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors"><X size={16}/></button>
                                </>
                            )}
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map(order => (
                    <div key={order.id} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="font-mono text-xs text-gray-500">#{order.id.slice(0,6)}</span>
                                <h3 className="font-bold text-gray-900 dark:text-white">{order.customerName}</h3>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'Shipped' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{order.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
                        <div className="flex justify-between items-center pt-2">
                             <span className="font-bold text-lg dark:text-white">₹{(order.finalTotal||order.total).toLocaleString()}</span>
                             <div className="flex gap-2">
                                <button onClick={() => handlePrintOrder(order)} className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Printer size={18}/></button>
                                {order.status === 'Pending' && (
                                    <>
                                    <button onClick={() => onUpdateOrderStatus(order.id, 'Shipped')} className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><Check size={18}/></button>
                                    <button onClick={() => onUpdateOrderStatus(order.id, 'Rejected')} className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg"><X size={18}/></button>
                                    </>
                                )}
                             </div>
                        </div>
                    </div>
                ))}
            </div>
             {orders.length === 0 && <div className="p-8 text-center text-gray-400">No orders yet</div>}
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Product</h2>
              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="px-4 py-2 border dark:border-gray-700 rounded-lg w-full dark:bg-gray-800 dark:text-white" />
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})} className="px-4 py-2 border dark:border-gray-700 rounded-lg w-full dark:bg-gray-800 dark:text-white">
                         {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input required type="number" placeholder="Price (₹)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="px-4 py-2 border dark:border-gray-700 rounded-lg w-full dark:bg-gray-800 dark:text-white" />
                    <input required type="number" placeholder="Stock Qty" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="px-4 py-2 border dark:border-gray-700 rounded-lg w-full dark:bg-gray-800 dark:text-white" />
                </div>
                <textarea required rows={2} placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="px-4 py-2 border dark:border-gray-700 rounded-lg w-full dark:bg-gray-800 dark:text-white" />
                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
                    <input type="file" accept="image/*" onChange={handleProductImageSelect} className="hidden" id="prod-img" />
                    <label htmlFor="prod-img" className="cursor-pointer flex flex-col items-center gap-2">
                        {imageFile ? <div className="text-green-600 dark:text-green-400 font-medium truncate w-full">{imageFile.name}</div> : <><ImageIcon className="text-gray-400" /> <span className="text-sm text-gray-500">Click to upload image</span></>}
                    </label>
                </div>
                <button type="submit" disabled={isUploading} className="w-full bg-gray-900 dark:bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  {isUploading ? <Loader2 className="animate-spin" /> : <Plus size={20} />} Add Product
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Current Inventory</h2>
              <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-5 hover:shadow-lg transition-all duration-300">
                    <div className="w-full sm:w-32 h-40 sm:h-32 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                         <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">{product.category}</span>
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mt-0.5">{product.name}</h4>
                         </div>
                         <p className="text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">₹{product.price}</p>
                      </div>
                      <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                           <div className="flex items-center gap-3 w-full sm:w-auto">
                               <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                                  <button onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 1))} className="px-3 py-1 hover:bg-white dark:hover:bg-gray-700 rounded-l-lg transition-colors">-</button>
                                  <span className="w-10 text-center text-sm font-bold dark:text-white">{product.stock}</span>
                                  <button onClick={() => onUpdateStock(product.id, product.stock + 1)} className="px-3 py-1 hover:bg-white dark:hover:bg-gray-700 rounded-r-lg transition-colors">+</button>
                               </div>
                           </div>
                           <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                              <button onClick={() => setReviewModalOpen(product.id)} className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                  <MessageSquare size={14} /> Add Review
                              </button>
                              <button onClick={() => onDeleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                  <Trash2 size={18} />
                              </button>
                           </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold dark:text-white mb-4">Add Coupon</h2>
              <form onSubmit={handleCouponSubmit} className="flex gap-4 mb-6">
                  <input type="text" placeholder="CODE" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} className="border dark:border-gray-700 rounded-lg px-4 py-2 uppercase w-32 dark:bg-gray-800 dark:text-white" />
                  <input type="number" placeholder="%" value={newCoupon.discountPercent} onChange={e => setNewCoupon({...newCoupon, discountPercent: Number(e.target.value)})} className="border dark:border-gray-700 rounded-lg px-4 py-2 w-20 dark:bg-gray-800 dark:text-white" />
                  <button type="submit" className="bg-gray-900 dark:bg-primary text-white px-4 rounded-lg">Add</button>
              </form>
              <div className="space-y-2">
                  {coupons.map(c => (
                      <div key={c.code} className="flex justify-between border dark:border-gray-700 p-3 rounded-lg dark:bg-gray-800">
                          <span className="font-mono font-bold dark:text-white">{c.code}</span>
                          <span className="text-green-600 dark:text-green-400">{c.discountPercent}% OFF</span>
                          <button onClick={() => onDeleteCoupon(c.code)} className="text-red-500 hover:text-red-600"><Trash2 size={16}/></button>
                      </div>
                  ))}
              </div>
           </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
             <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white">Registered Users ({users.length})</h2>
                <Users className="text-primary" />
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm">
                   <tr>
                     <th className="p-4">Name</th>
                     <th className="p-4">Email / Login ID</th>
                     <th className="p-4">Password</th>
                     <th className="p-4">Join Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {users.map(user => (
                       <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                         <td className="p-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs uppercase">
                                  {user.name[0]}
                               </div>
                               <div className="font-medium dark:text-white">{user.name}</div>
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                               <Mail size={14} /> {user.email}
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="flex items-center gap-2 font-mono text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded w-fit">
                               <Lock size={12} className="text-gray-400" /> {user.password}
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                               <Calendar size={14} /> {new Date(user.joinDate).toLocaleDateString()}
                            </div>
                         </td>
                       </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             {users.length === 0 && <div className="p-12 text-center text-gray-400">No registered users yet.</div>}
           </div>
        )}

        {reviewModalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReviewModalOpen(null)} />
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md relative z-10 animate-in zoom-in-95">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Add Admin Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <input required placeholder="Customer Name" value={newReview.userName} onChange={e => setNewReview({...newReview, userName: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2" />
                        <div>
                            <label className="text-xs text-gray-500">Rating</label>
                            <div className="flex gap-2">
                                {[1,2,3,4,5].map(r => (
                                    <button key={r} type="button" onClick={() => setNewReview({...newReview, rating: r})} className={`p-1 rounded ${newReview.rating >= r ? 'text-yellow-400' : 'text-gray-300'}`}>
                                        <Star fill="currentColor" size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea required placeholder="Comment" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2" rows={3} />
                        <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-center">
                            <input type="file" accept="image/*" onChange={handleReviewImageSelect} className="hidden" id="rev-img" />
                            <label htmlFor="rev-img" className="cursor-pointer flex flex-col items-center gap-1">
                                {reviewImageFile ? <div className="text-green-600 dark:text-green-400 text-sm truncate">{reviewImageFile.name}</div> : <><ImageIcon className="text-gray-400" size={20} /> <span className="text-xs text-gray-500 dark:text-gray-400">Add Customer Photo (Optional)</span></>}
                            </label>
                        </div>
                        <button type="submit" disabled={isUploading} className="w-full bg-blue-600 dark:bg-primary text-white py-3 rounded-xl font-bold transition-all">
                            {isUploading ? 'Saving...' : 'Submit Review'}
                        </button>
                    </form>
                    <button onClick={() => setReviewModalOpen(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
