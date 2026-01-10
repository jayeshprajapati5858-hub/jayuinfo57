
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import { SHOP_NAME } from '../constants';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
        setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-2">Contact Us</h1>
        <p className="text-center text-gray-500 mb-12">We'd love to hear from you. Send us a message!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Info Card */}
           <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col justify-between">
              <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h3>
                  <div className="space-y-6">
                      <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl text-primary">
                             <MapPin size={24} />
                          </div>
                          <div>
                              <p className="font-bold text-gray-900 dark:text-white">Our Office</p>
                              <p className="text-sm text-gray-500 mt-1">123 Mobile Market, Tech City,<br/>Gujarat, India - 380001</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl text-primary">
                             <Mail size={24} />
                          </div>
                          <div>
                              <p className="font-bold text-gray-900 dark:text-white">Email Us</p>
                              <p className="text-sm text-gray-500 mt-1">support@mobilehub.com</p>
                              <p className="text-sm text-gray-500">sales@mobilehub.com</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl text-primary">
                             <Phone size={24} />
                          </div>
                          <div>
                              <p className="font-bold text-gray-900 dark:text-white">Call Us</p>
                              <p className="text-sm text-gray-500 mt-1">+91 98765 43210</p>
                              <p className="text-[10px] text-gray-400">Mon-Sat from 9am to 6pm</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-400">Follow us on social media for updates and offers.</p>
              </div>
           </div>

           {/* Form */}
           <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              {submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle className="text-green-500" size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-500">Thank you for contacting us. We will get back to you within 24 hours.</p>
                      <button onClick={() => setSubmitted(false)} className="mt-8 text-primary font-bold hover:underline">Send another message</button>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent focus:border-primary outline-none transition-all dark:text-white" placeholder="John Doe" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent focus:border-primary outline-none transition-all dark:text-white" placeholder="john@example.com" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                          <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent focus:border-primary outline-none transition-all dark:text-white resize-none" placeholder="How can we help you?" />
                      </div>
                      <button type="submit" className="w-full bg-gray-900 dark:bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                          <Send size={18} /> Send Message
                      </button>
                  </form>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
