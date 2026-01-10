
import React, { useState } from 'react';
import { User, Address } from '../types';
import { MapPin, Plus, Trash2, User as UserIcon, Save, Phone, Mail } from 'lucide-react';
import { api } from '../services/api';

interface UserProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phoneNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    id: '', label: '', details: '', city: '', zip: ''
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const updatedUser = { ...user, name, email, phoneNumber: phone };
    const success = await api.updateUser(updatedUser);
    if (success) {
      onUpdateUser(updatedUser);
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
    setIsSaving(false);
  };

  const handleAddAddress = async () => {
    if (!newAddress.details || !newAddress.city) return;
    const addressEntry: Address = { ...newAddress, id: Date.now().toString() };
    const updatedAddresses = [...(user.addresses || []), addressEntry];
    const updatedUser = { ...user, addresses: updatedAddresses };
    
    setIsSaving(true);
    const success = await api.updateUser(updatedUser);
    if (success) {
      onUpdateUser(updatedUser);
      setShowAddressForm(false);
      setNewAddress({ id: '', label: '', details: '', city: '', zip: '' });
    }
    setIsSaving(false);
  };

  const handleDeleteAddress = async (id: string) => {
    const updatedAddresses = (user.addresses || []).filter(a => a.id !== id);
    const updatedUser = { ...user, addresses: updatedAddresses };
    
    setIsSaving(true);
    const success = await api.updateUser(updatedUser);
    if (success) {
      onUpdateUser(updatedUser);
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pt-24 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            <UserIcon size={18} /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ${activeTab === 'addresses' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            <MapPin size={18} /> Address Book
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary">
                    <UserIcon size={18} className="text-gray-400" />
                    <input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="bg-transparent outline-none w-full font-medium dark:text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary">
                    <Mail size={18} className="text-gray-400" />
                    <input 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="bg-transparent outline-none w-full font-medium dark:text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary">
                    <Phone size={18} className="text-gray-400" />
                    <input 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      className="bg-transparent outline-none w-full font-medium dark:text-white" 
                      placeholder="+91"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-gray-900 dark:bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Addresses</h2>
                 <button 
                   onClick={() => setShowAddressForm(!showAddressForm)}
                   className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
                 >
                   <Plus size={16} /> Add New
                 </button>
               </div>

               {showAddressForm && (
                 <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
                    <input placeholder="Label (e.g. Home)" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm" />
                    <textarea placeholder="Address Details" value={newAddress.details} onChange={e => setNewAddress({...newAddress, details: e.target.value})} className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm" />
                    <div className="flex gap-2">
                        <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm" />
                        <input placeholder="Zip Code" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShowAddressForm(false)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancel</button>
                      <button onClick={handleAddAddress} disabled={isSaving} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg">{isSaving ? 'Saving...' : 'Save Address'}</button>
                    </div>
                 </div>
               )}

               <div className="space-y-3">
                 {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map(addr => (
                      <div key={addr.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-2xl flex justify-between items-start group hover:border-primary/30 transition-colors">
                         <div>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{addr.label || 'Home'}</span>
                            <p className="font-bold text-gray-900 dark:text-white mt-2">{addr.details}</p>
                            <p className="text-sm text-gray-500">{addr.city} - {addr.zip}</p>
                         </div>
                         <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                         </button>
                      </div>
                    ))
                 ) : (
                   <p className="text-gray-400 text-center py-8">No addresses saved yet.</p>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
