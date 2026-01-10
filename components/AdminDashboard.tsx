
import React, { useState, useRef } from 'react';
import { Product, Order, Category, Coupon, Review, User } from '../types';
import { Plus, Package, Check, X, ArrowLeft, Printer, Trash2, Tag, Image as ImageIcon, Loader2, Star, MessageSquare, Users, Mail, Lock, Calendar, Server } from 'lucide-react';
import { SHOP_NAME } from '../constants';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  users: User[];
  serverStatus?: 'online' | 'offline' | 'checking';
  onUpdateOrderStatus: (orderId: string, status: 'Shipped' | 'Rejected') => void;
  onAddProduct: (product: Product) => Promise<void> | void; // Allow promise
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
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons' | 'users'>('orders');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: Category.COVER,
    description: '',
    colors: '', // Comma separated string
    stock: 50,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
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
    try {
        let imageUrls: string[] = [];
        
        if (imageFiles.length > 0) {
           const promises = imageFiles.map(file => handleFileToUrl(file));
           imageUrls = await Promise.all(promises);
        } else {
            imageUrls = [`https://picsum.photos/400/400?random=${Date.now()}`];
        }

        const colorList = newProduct.colors.split(',').map(c => c.trim()).filter(c => c !== '');

        const product: Product = {
          id: Date.now().toString(),
          name: newProduct.name,
          price: Number(newProduct.price),
          category: newProduct.category,
          description: newProduct.description,
          image: imageUrls[0], // Main image is the first one
          images: imageUrls,
          colors: colorList.length > 0 ? colorList : ['Default'],
          rating: 0,
          stock: Number(newProduct.stock),
          sales: 0,
          reviews: []
        };

        // Await the add operation
        await onAddProduct(product);
        
        setNewProduct({ name: '', price: '', category: Category.COVER, description: '', colors: '', stock: 50 });
        setImageFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
        console.error("Dashboard error:", error);
    } finally {
        setIsUploading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reviewModalOpen || !onAddReview) return;

      setIsUploading(true);
      try {
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
      } finally {
          setIsUploading(false);
      }
  };

  const handleProductImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setImageFiles(Array.from(e.target.files));
    }
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
            <thead><tr><th>Item</th><th>Color</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>
              ${order.items.map(item => `<tr><td>${item.name}</td><td>${item.selectedColor || '-'}</td><td>${item.quantity}</td><td>₹${item.quantity * item.price}</td></tr>`).join('')}
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
               {serverStatus === 'online' ? 'Firebase Connected' : 'Checking...'}
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
        </div>

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
                        <td className="p-4 text-sm dark:text-gray-300">
                            {order.items.map(i => (
                                <div key={i.id} className="text-xs">
                                    {i.name} {i.selectedColor ? `(${i.selectedColor})` : ''} x{i.quantity}
                                </div>
                            ))}
                        </td>
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
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                             {order.items.map(i => (
                                <div key={i.id}>• {i.name} {i.selectedColor ? `(${i.selectedColor})` : ''} x{i.quantity}</div>
                            ))}
                        </div>
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
                
                <input type="text" placeholder="Colors (e.g. Red, Black, Blue)" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} className="px-4 py-2 border dark:border-gray-700 rounded-lg w-full dark:bg-gray-800 dark:text-white" />
                
                <textarea required rows={2} placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="px-4 py-2 border dark:border-gray-700 rounded-lg w-full dark:bg-gray-800 dark:text-white" />
                
                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
                    <input type="file" accept="image/*" multiple onChange={handleProductImageSelect} className="hidden" id="prod-img" ref={fileInputRef} />
                    <label htmlFor="prod-img" className="cursor-pointer flex flex-col items-center gap-2">
                        {imageFiles.length > 0 ? (
                            <div className="text-green-600 dark:text-green-400 font-medium">{imageFiles.length} Images Selected</div>
                        ) : (
                            <><ImageIcon className="text-gray-400" /> <span className="text-sm text-gray-500">Click to upload multiple images</span></>
                        )}
                    </label>
                </div>
                
                <button type="submit" disabled={isUploading} className="w-full bg-gray-900 dark:bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  {isUploading ? <Loader2 className="animate-spin" /> : <Plus size={20} />} {isUploading ? "Uploading..." : "Add Product"}
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
                            <div className="flex gap-1 mt-1">
                                {product.colors?.map(c => <span key={c} className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{c}</span>)}
                            </div>
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
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create New Coupon</h2>
               <form onSubmit={handleCouponSubmit} className="flex gap-4 items-end">
                  <div className="flex-1">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code</label>
                     <input 
                        required 
                        type="text" 
                        placeholder="e.g. SUMMER50" 
                        value={newCoupon.code} 
                        onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} 
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:text-white font-mono uppercase" 
                     />
                  </div>
                  <div className="w-32">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount (%)</label>
                     <input 
                        required 
                        type="number" 
                        min="1" 
                        max="100" 
                        value={newCoupon.discountPercent} 
                        onChange={e => setNewCoupon({...newCoupon, discountPercent: Number(e.target.value)})} 
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:text-white" 
                     />
                  </div>
                  <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors h-[50px]">
                     <Plus size={20} /> Add
                  </button>
               </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {coupons.map(coupon => (
                  <div key={coupon.code} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex justify-between items-center group relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Tag size={64} />
                     </div>
                     <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Coupon</p>
                        <h3 className="text-2xl font-black text-primary font-mono">{coupon.code}</h3>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{coupon.discountPercent}% Off</p>
                     </div>
                     <button onClick={() => onDeleteCoupon(coupon.code)} className="relative z-10 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                        <Trash2 size={20} />
                     </button>
                  </div>
               ))}
               {coupons.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400">
                     <Tag size={48} className="mx-auto mb-4 opacity-20" />
                     <p>No active coupons found.</p>
                  </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email/Phone</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">User ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {users.map(user => (
                     <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                              {user.name[0]}
                           </div>
                           {user.name}
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{user.email || user.phoneNumber || 'N/A'}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{new Date(user.joinDate).toLocaleDateString()}</td>
                        <td className="p-4 text-xs font-mono text-gray-400">{user.id}</td>
                     </tr>
                  ))}
                </tbody>
             </table>
             {users.length === 0 && <div className="p-8 text-center text-gray-400">No users found.</div>}
           </div>
        )}
      </div>

      {reviewModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReviewModalOpen(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
             <button onClick={() => setReviewModalOpen(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X size={20} />
             </button>
             
             <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                <MessageSquare className="text-primary" /> Add Admin Review
             </h3>
             
             <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">User Name (Display)</label>
                   <input 
                     className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 dark:text-white outline-none focus:border-primary transition-colors"
                     placeholder="e.g. Verified Buyer" 
                     value={newReview.userName} 
                     onChange={e => setNewReview({...newReview, userName: e.target.value})}
                     required
                   />
                </div>
                
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
                   <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button type="button" key={star} onClick={() => setNewReview({...newReview, rating: star})}>
                           <Star size={28} className={star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-700"} />
                        </button>
                      ))}
                   </div>
                </div>
                
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Review Content</label>
                   <textarea 
                     rows={3}
                     className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 dark:text-white outline-none focus:border-primary transition-colors"
                     placeholder="Write the review text here..." 
                     value={newReview.comment} 
                     onChange={e => setNewReview({...newReview, comment: e.target.value})}
                     required
                   />
                </div>
                
                <button type="submit" disabled={isUploading} className="w-full py-3 bg-gray-900 dark:bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2">
                   {isUploading ? <Loader2 className="animate-spin" /> : <Check size={18} />} Submit Review
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;