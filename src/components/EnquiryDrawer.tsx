import React, { useState } from 'react';
import { X, Calendar, Home, Phone, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { hotel } from '../data/hotel';
import { submitEnquiry, buildWhatsAppEnquiryUrl, type EnquiryPayload } from '../lib/enquiry';

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY = {
  name: '',
  phone: '',
  checkIn: '',
  checkOut: '',
  guests: '1',
  roomType: hotel.roomTypes[0],
};

export function EnquiryDrawer({ open, onClose }: Props) {
  const [formData, setFormData] = useState(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [whatsAppFallback, setWhatsAppFallback] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setWhatsAppFallback('');

    const payload: EnquiryPayload = { source: 'Floating enquiry drawer', ...formData };

    try {
      await submitEnquiry(payload);
      setFormData(EMPTY);
      setStatus('success');
    } catch {
      setWhatsAppFallback(buildWhatsAppEnquiryUrl(payload));
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-gray-900/50"
          />

          {/* Drawer — slides up on mobile, slides in from right on desktop */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-2xl shadow-2xl md:left-auto md:right-6 md:bottom-6 md:w-[420px] md:rounded-2xl"
          >
            <div className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-gray-900">Quick Enquiry</h3>
                  <p className="text-xs text-gray-500 mt-0.5">We'll call you back to confirm availability.</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                        placeholder="Mobile"
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Check-in *</label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input type="date" name="checkIn" required value={formData.checkIn} onChange={handleChange}
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Check-out *</label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input type="date" name="checkOut" required value={formData.checkOut} onChange={handleChange}
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Room Type</label>
                  <div className="relative">
                    <Home className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <select name="roomType" value={formData.roomType} onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 outline-none appearance-none">
                      {hotel.roomTypes.map((room) => (
                        <option key={room}>{room}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-maroon-800 text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-maroon-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending…' : 'Send Enquiry'}
                </button>

                {status === 'success' && (
                  <div className="flex items-start gap-2 rounded-md bg-emerald-50 border border-emerald-200/80 px-3 py-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-emerald-800">
                      Enquiry sent! We'll contact you shortly.
                    </p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="rounded-md bg-amber-50 border border-amber-200/80 px-3 py-2.5 space-y-2.5">
                    <p className="text-sm font-medium text-amber-900">
                      Couldn't submit just now — send your details on WhatsApp instead, they're already filled in.
                    </p>
                    <a
                      href={whatsAppFallback}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send on WhatsApp
                    </a>
                  </div>
                )}
              </form>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>Prefer messaging?</span>
                <a href={`https://wa.me/${hotel.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-emerald-600 font-medium hover:text-emerald-700">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp us
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
