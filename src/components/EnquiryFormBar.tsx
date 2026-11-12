import React, { useState } from 'react';
import { Calendar, Home, Phone, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { hotel } from '../data/hotel';
import { submitEnquiry, buildWhatsAppEnquiryUrl, type EnquiryPayload } from '../lib/enquiry';
import { ConsentFields, EMPTY_CONSENT } from './ConsentFields';

const EMPTY = {
  name: '',
  phone: '',
  checkIn: '',
  checkOut: '',
  guests: '1',
  roomType: hotel.roomTypes[0],
};

export function EnquiryFormBar() {
  const [formData, setFormData] = useState(EMPTY);
  const [consent, setConsent] = useState(EMPTY_CONSENT);
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  // Retain a wa.me link built from the guest's input so a failed email send
  // still reaches the hotel without re-typing.
  const [whatsAppFallback, setWhatsAppFallback] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setWhatsAppFallback('');

    const payload: EnquiryPayload = {
      source: 'Quick availability enquiry',
      ...formData,
      consent: 'yes',
      ageConfirmed: 'yes',
      website,
    };

    try {
      await submitEnquiry(payload);
      setFormData(EMPTY);
      setConsent(EMPTY_CONSENT);
      setStatus('success');
    } catch {
      // Do not blame the guest — offer the WhatsApp fallback pre-filled.
      setWhatsAppFallback(buildWhatsAppEnquiryUrl(payload));
      setStatus('error');
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

            <div className="col-span-1 md:col-span-2 lg:col-span-6 relative"><ConsentFields idPrefix="enq" value={consent} onChange={setConsent} website={website} onWebsiteChange={setWebsite} /></div>

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

          {status === 'success' && (
            <div className="mt-4 flex items-start gap-2.5 rounded-md bg-emerald-50 border border-emerald-200/80 px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emerald-800">
                Thank you for your enquiry. Our team will contact you shortly to confirm availability.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md bg-amber-50 border border-amber-200/80 px-4 py-3">
              <p className="text-sm font-medium text-amber-900 flex-grow">
                We couldn't submit the form just now. Send your details on WhatsApp instead — they're already filled in.
              </p>
              <a
                href={whatsAppFallback}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Send on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
