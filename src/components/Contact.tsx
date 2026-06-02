import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { motion } from 'motion/react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for getting in touch. Our team will contact you shortly.');
  };

  return (
    <section id="contact" className="py-20 bg-maroon-900 overflow-hidden relative">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-maroon-800 rounded-full blur-[100px] opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Details */}
          <div className="text-white">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Contact Hotel Royal Fort</h2>
            <p className="text-maroon-100/80 mb-10 text-lg">We are here to assist you. Reach out for bookings, corporate rates, or any general enquiries.</p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4 p-4 rounded-xl pb-0 text-left hover:bg-maroon-800/50 transition-colors border border-transparent">
                  <div className="flex-shrink-0 mt-1 bg-maroon-800 p-3 rounded-lg text-gold-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-maroon-100/90 text-sm mb-2">Available 24/7 for booking support</p>
                    <a href="tel:+910000000000" className="text-xl font-semibold hover:text-gold-400 transition-colors">+91 00000 00000</a>
                  </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl pb-0 text-left hover:bg-maroon-800/50 transition-colors border border-transparent">
                  <div className="flex-shrink-0 mt-1 bg-maroon-800 p-3 rounded-lg text-emerald-400">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                    <p className="text-maroon-100/90 text-sm mb-2">Message us for quick replies</p>
                    <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:text-emerald-400 transition-colors">+91 00000 00000</a>
                  </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl pb-0 text-left hover:bg-maroon-800/50 transition-colors border border-transparent">
                  <div className="flex-shrink-0 mt-1 bg-maroon-800 p-3 rounded-lg text-gold-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-maroon-100/90 text-sm mb-2">Send us your detailed enquiries</p>
                    <a href="mailto:contact@hotelroyalfort.com" className="text-lg font-semibold hover:text-gold-400 transition-colors">contact@hotelroyalfort.com</a>
                  </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl pb-0 text-left hover:bg-maroon-800/50 transition-colors border border-transparent">
                  <div className="flex-shrink-0 mt-1 bg-maroon-800 p-3 rounded-lg text-gold-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-maroon-100/90 text-sm mb-2">Hotel Royal Fort, Near Royal Circle, Ballari, Karnataka - 583101</p>
                    <a href="https://maps.app.goo.gl/vVGSAApmL79wqteK8" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors mt-1 border-b border-gold-400/30 hover:border-gold-300 pb-0.5">
                      Get Google Maps Directions
                    </a>
                  </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-black/10"
          >
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Send an Enquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Name <span className="text-maroon-600">*</span></label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 outline-none text-sm transition-all" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Phone <span className="text-maroon-600">*</span></label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 outline-none text-sm transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 outline-none text-sm transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Check-in</label>
                  <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 outline-none text-sm transition-all" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Check-out</label>
                  <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 outline-none text-sm transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Message / Special Requests</label>
                <textarea name="message" rows={3} value={formData.message} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 outline-none text-sm transition-all resize-none"></textarea>
              </div>
              
              <button type="submit" className="w-full bg-maroon-800 text-white font-medium py-3 rounded-md flex items-center justify-center gap-2 hover:bg-maroon-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-maroon-800 mt-2">
                <Send className="w-4 h-4" />
                Submit Enquiry
              </button>
            </form>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
