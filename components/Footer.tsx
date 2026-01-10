
import React from 'react';
import { Smartphone, Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (page: 'privacy' | 'terms' | 'about') => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg text-white">
                <Smartphone size={20} />
              </div>
              <span className="text-xl font-bold text-white">
                MobileHub
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Your one-stop destination for premium mobile accessories. We provide the best quality chargers, covers, and audio gear with a warranty you can trust.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors text-left">Home</button></li>
              <li><button onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors text-left">All Products</button></li>
              <li><button onClick={() => onOpenLegal('about')} className="hover:text-primary transition-colors text-left">About Us</button></li>
              <li><button onClick={() => onOpenLegal('terms')} className="hover:text-primary transition-colors text-left">Terms & Conditions</button></li>
              <li><button onClick={() => onOpenLegal('privacy')} className="hover:text-primary transition-colors text-left">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Categories</h3>
            <ul className="space-y-4 text-sm">
              <li><span className="text-gray-400 cursor-default">Chargers & Adapters</span></li>
              <li><span className="text-gray-400 cursor-default">Mobile Covers</span></li>
              <li><span className="text-gray-400 cursor-default">Screen Guards</span></li>
              <li><span className="text-gray-400 cursor-default">Audio & Headphones</span></li>
              <li><span className="text-gray-400 cursor-default">Data Cables</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5" />
                <span>123 Mobile Market, Tech City,<br />Gujarat, India - 380001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>support@mobilehub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MobileHub Accessories. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
