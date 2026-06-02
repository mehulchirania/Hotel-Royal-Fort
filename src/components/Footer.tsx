import React from 'react';
import { Facebook, Instagram, Twitter, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 lg:py-16 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-maroon-800 rounded-lg flex items-center justify-center">
                 <span className="text-gold-500 font-serif text-xl font-bold">RF</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-white leading-none">Hotel Royal Fort</span>
                <span className="text-[10px] uppercase tracking-widest text-maroon-500 font-medium">Ballari</span>
              </div>
            </div>
            <p className="text-sm mb-6 leading-relaxed max-w-xs">
              Comfortable, clean, and convenient stays in the heart of Ballari. Perfect for families and business travellers.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-maroon-800 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-maroon-800 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-maroon-800 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-gold-400 transition-colors">Home</a></li>
              <li><a href="#rooms" className="hover:text-gold-400 transition-colors">Rooms & Tariffs</a></li>
              <li><a href="#amenities" className="hover:text-gold-400 transition-colors">Amenities</a></li>
              <li><a href="#gallery" className="hover:text-gold-400 transition-colors">Gallery</a></li>
              <li><a href="#contact" className="hover:text-gold-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Cancellation Policy</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Location</h4>
            <div className="text-sm space-y-3">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-maroon-600 flex-shrink-0 mt-0.5" />
                Hotel Royal Fort, Near Royal Circle, Ballari, Karnataka 583101
              </p>
              <a href="https://maps.app.goo.gl/vVGSAApmL79wqteK8" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-gold-500 hover:text-gold-400 text-xs font-semibold uppercase tracking-wider transition-colors border-b border-gold-500/30 pb-0.5">
                Open in Google Maps
              </a>
            </div>
          </div>

        </div>
        
        <div className="pt-8 border-t border-gray-900 text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>© 2026 Hotel Royal Fort, Ballari. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
