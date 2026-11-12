import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { hotel } from '../data/hotel';
import { submitEnquiry } from '../lib/enquiry';
import { ConsentFields, EMPTY_CONSENT } from './ConsentFields';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    message: ''
  });
  const [consent, setConsent] = useState(EMPTY_CONSENT);
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    try {
      await submitEnquiry({
        source: 'Contact form enquiry',
        ...formData,
        consent: 'yes',
        ageConfirmed: 'yes',
        website,
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        checkIn: '',
        checkOut: '',
        message: '',
      });
      setConsent(EMPTY_CONSENT);
      setStatusMessage('Thank you for getting in touch. Our team will contact you shortly.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to send enquiry right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-maroon-900 overflow-hidden relative">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-maroon-800 rounded-full blur-[100px] opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Details */}
          <div className="text-white">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Contact Hotel Royal Fort</h1>
            <p className="text-maroon-100/80 mb-10 text-lg">We are here to assist you. Reach out for bookings, corporate rates, or any general enquiries.</p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4 p-4 rounded-xl pb-0 text-left hover:bg-maroon-800/50 transition-colors border border-transparent">
                  <div className="flex-shrink-0 mt-1 bg-maroon-800 p-3 rounded-lg text-gold-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-maroon-100/90 text-sm mb-2">Available 24/7 for booking support</p>
                    <a href={`tel:${hotel.phoneTel}`} className="text-xl font-semibold hover:text-gold-400 transition-colors">{hotel.phoneDisplay}</a>
                  </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl pb-0 text-left hover:bg-maroon-800/50 transition-colors border border-transparent">
                  <div className="flex-shrink-0 mt-1 bg-maroon-800 p-3 rounded-lg text-emerald-400">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                    <p className="text-maroon-100/90 text-sm mb-2">Message us for quick replies</p>
                    <a href={`https://wa.me/${hotel.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:text-emerald-400 transition-colors">{hotel.phoneDisplay}</a>
                  </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl pb-0 text-left hover:bg-maroon-800/50 transition-colors border border-transparent">
                  <div className="flex-shrink-0 mt-1 bg-maroon-800 p-3 rounded-lg text-gold-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-maroon-100/90 text-sm mb-2">Send us your detailed enquiries</p>
                    <a href={`mailto:${hotel.email}`} className="text-lg font-semibold hover:text-gold-400 transition-colors">{hotel.email}</a>
                  </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl pb-0 text-left hover:bg-maroon-800/50 transition-colors border border-transparent">
                  <div className="flex-shrink-0 mt-1 bg-maroon-800 p-3 rounded-lg text-gold-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-maroon-100/90 text-sm mb-2">{hotel.address}</p>
                    <a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors mt-1 border-b border-gold-400/30 hover:border-gold-300 pb-0.5">
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
              
              <div className="relative"><ConsentFields idPrefix="con" value={consent} onChange={setConsent} website={website} onWebsiteChange={setWebsite} /></div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-maroon-800 text-white font-medium py-3 rounded-md flex items-center justify-center gap-2 hover:bg-maroon-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-maroon-800 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
              </button>
              {statusMessage && (
                <p className="text-sm font-medium text-gray-700">{statusMessage}</p>
              )}
            </form>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
