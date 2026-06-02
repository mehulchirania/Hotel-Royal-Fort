import React, { useState } from 'react';
import { Calendar, Users, Home, Phone, Send, MessageCircle } from 'lucide-react';
import { hotel } from '../data/hotel';
import { submitEnquiry } from '../lib/enquiry';

export function EnquiryFormBar() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    roomType: hotel.roomTypes[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    try {
      await submitEnquiry({
        source: 'Quick availability enquiry',
        ...formData,
      });
      setFormData({
        name: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '1',
        roomType: hotel.roomTypes[0],
      });
      setStatusMessage('Thank you for your enquiry. We will contact you shortly.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to send enquiry right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quick-enquiry" className="bg-maroon-900 py-8 border-y-4 border-gold-500 relative z-20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6 md:p-8 transform md:-translate-y-16 mt-8 md:mt-0 relative z-30">
          
          <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900">Check Availability & Enquire</h2>
                <p className="text-gray-500 text-sm mt-1">Get the best rates by booking directly with us.</p>
             </div>
             <a href={`https://wa.me/${hotel.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Prefer WhatsApp?
             </a>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            
            <div className="relative col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Guest Name <span className="text-maroon-600">*</span></label>
              <input 
                type="text" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Name" 
                className="w-full pl-3 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none transition-all text-sm"
              />
            </div>
            
            <div className="relative col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Phone <span className="text-maroon-600">*</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="tel" 
                  name="phone" 
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Mobile" 
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="relative col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Check-in <span className="text-maroon-600">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  name="checkIn" 
                  required
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="relative col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Check-out <span className="text-maroon-600">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  name="checkOut" 
                  required
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="relative col-span-1 lg:col-span-1 hidden lg:block">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Room Type</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none transition-all text-sm appearance-none"
                >
                  {hotel.roomTypes.map((room) => (
                    <option key={room}>{room}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative col-span-1 md:col-span-2 lg:col-span-1 flex items-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-maroon-800 text-white flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium hover:bg-maroon-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-maroon-800 h-[42px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Enquiry'}
              </button>
            </div>
            
          </form>
          {statusMessage && (
            <p className="mt-4 text-sm font-medium text-gray-700">{statusMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}
