
import React, { useState } from 'react';
import { Product, Order, Category, Coupon } from '../types';
import { Plus, Package, Check, X, ArrowLeft, Printer, Trash2, Tag, Upload, Image as ImageIcon } from 'lucide-react';
import { SHOP_NAME } from '../constants';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  onUpdateOrderStatus: (orderId: string, status: 'Shipped' | 'Rejected') => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, 
  products, 
  coupons,
  onUpdateOrderStatus, 
  onAddProduct, 
  onDeleteProduct,
  onUpdateStock,
  onAddCoupon,
  onDeleteCoupon,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons'>('orders');
  
  // Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: Category.COVER,
    description: '',
    image: 'https://picsum.photos/400/400',
    stock: 50
  });

  // Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 10
  });

  const totalEarnings = orders
    .filter(o => o.status !== 'Rejected')
    .reduce((sum, order) => sum + (order.finalTotal || order.total), 0);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image || `https://picsum.photos/400/400?random=${Date.now()}`,
      rating: 4.5, // Default rating
      stock: Number(newProduct.stock),
      reviews: []
    };
    onAddProduct(product);
    setNewProduct({ name: '', price: '', category: Category.COVER, description: '', image: 'https://picsum.photos/400/400', stock: 50 });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newCoupon.code) return;
    onAddCoupon({
      code: newCoupon.code.toUpperCase(),
      discountPercent: Number(newCoupon.discountPercent),
      isActive: true
    });
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
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            .invoice-title { font-size: 20px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
            
            .address-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .address-box { width: 45%; }
            .address-title { font-size: 12px; font-weight: bold; color: #999; text-transform: uppercase; margin-bottom: 10px; }
            .address-content { font-size: 16px; line-height: 1.5; border: 1px dashed #ccc; padding: 15px; border-radius: 8px; background: #f9fafb; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #eee; color: #666; font-size: 14px; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            
            .total-section { text-align: right; margin-top: 20px; }
            .total-row { font-size: 20px; font-weight: bold; color: #000; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            
            @media print {
              body { padding: 0; }
              .address-content { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">${SHOP_NAME}</div>
            <div class="invoice-title">Order Invoice</div>
          </div>

          <div class="address-section">
            <div class="address-box">
              <div class="address-title">From (Seller)</div>
              <div class="address-content">
                <strong>${SHOP_NAME} Store</strong><br>
                123 Mobile Market,<br>
                Tech City, Gujarat - 380001
              </div>
            </div>
            <div class="address-box">
              <div class="address-title">To (Shipping Address)</div>
              <div class="address-content">
                <strong>${order.customerName}</strong><br>
                ${order.address}<br>
                Order ID: #${order.id.slice(-6)}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price}</td>
                  <td>₹${item.quantity * item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            ${order.discount ? `<div>Subtotal: ₹${order.total}</div><div>Discount: -₹${order.discount}</div>` : ''}
            <div class="total-row">Total Amount: ₹${(order.finalTotal || order.total).toLocaleString()}</div>
            <p style="font-size: 14px; color: #666;">Payment Mode: Cash on Delivery</p>
          </div>

          <div class="footer">
            Thank you for shopping with ${SHOP_NAME}!<br>
            For support contact: support@mobilehub.com
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-400">Total Earnings</p>
              <p className="font-bold text-green-400">₹{totalEarnings.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total Orders</p>
              <p className="font-bold">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <Package size={20} /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'products' ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <Plus size={20} /> Products & Stock
          </button>
          <button 
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'coupons' ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <Tag size={20} /> Coupons
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Items</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">No orders received yet.</td>
                    </tr>
                  ) : (
                    orders.slice().reverse().map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm font-mono text-gray-500">#{order.id.slice(-6)}</td>
                        <td className="p-4">
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.address}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        </td>
                        <td className="p-4 font-bold text-gray-900">
                          ₹{(order.finalTotal || order.total).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Shipped' ? 'bg-green-100 text-green-700' :
                            order.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                             <button 
                                onClick={() => handlePrintOrder(order)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                title="Print Invoice"
                              >
                                <Printer size={18} />
                              </button>
                            {order.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => onUpdateOrderStatus(order.id, 'Shipped')}
                                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                  title="Accept Order"
                                >
                                  <Check size={18} />
                                </button>
                                <button 
                                  onClick={() => onUpdateOrderStatus(order.id, 'Rejected')}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Reject Order"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add New Product Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Product</h2>
              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input 
                    required
                    type="text"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="e.g. SuperFast Charger"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input 
                      required
                      type="number"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Qty</label>
                    <input 
                      required
                      type="number"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Product details..."
                  />
                </div>
                
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="flex gap-4 items-start">
                    {/* Preview */}
                    <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center relative group">
                        {newProduct.image ? (
                           <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                           <ImageIcon className="text-gray-300" />
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        {/* File Input */}
                        <label className="block w-full">
                           <input 
                             type="file" 
                             accept="image/*"
                             onChange={handleImageUpload}
                             className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2.5 file:px-4
                               file:rounded-xl file:border-0
                               file:text-sm file:font-semibold
                               file:bg-gray-100 file:text-gray-700
                               hover:file:bg-gray-200
                               cursor-pointer
                             "
                           />
                        </label>
                        <div className="text-center text-xs text-gray-400 font-medium flex items-center gap-2 before:h-[1px] before:flex-1 before:bg-gray-200 after:h-[1px] after:flex-1 after:bg-gray-200">
                          OR ENTER URL
                        </div>
                        {/* URL Input (Fallback) */}
                        <input 
                            type="text"
                            value={newProduct.image}
                            onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-gray-600"
                        />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add Product
                </button>
              </form>
            </div>

            {/* Current Products List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Current Inventory ({products.length})</h2>
              <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center group hover:shadow-md transition-shadow bg-gray-50/50">
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">₹{product.price}</p>
                    </div>
                    
                    {/* Stock Updater */}
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-500 font-medium">Stock:</span>
                      <button 
                        onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 1))}
                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
                      >
                        -
                      </button>
                      <span className={`w-8 text-center font-bold ${product.stock < 5 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</span>
                      <button 
                        onClick={() => onUpdateStock(product.id, product.stock + 1)}
                         className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => onDeleteProduct(product.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Coupon</h2>
              <form onSubmit={handleCouponSubmit} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <input 
                    required
                    type="text"
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none uppercase"
                    placeholder="e.g. SALE50"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    max="100"
                    value={newCoupon.discountPercent}
                    onChange={e => setNewCoupon({...newCoupon, discountPercent: Number(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary transition-colors mb-[1px]"
                >
                  Create
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Active Coupons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map(coupon => (
                  <div key={coupon.code} className="border border-green-100 bg-green-50 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-green-800 text-lg tracking-wider">{coupon.code}</h4>
                      <p className="text-sm text-green-600">{coupon.discountPercent}% Discount on all items</p>
                    </div>
                    <button 
                      onClick={() => onDeleteCoupon(coupon.code)}
                      className="p-2 text-green-600 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
