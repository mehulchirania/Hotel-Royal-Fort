import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { hotel } from '../data/hotel';
import { EnquiryDrawer } from './EnquiryDrawer';
import { useNav } from '../context/nav';

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { currentPage } = useNav();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer when navigating to contact page
  useEffect(() => {
    if (currentPage === 'contact') setDrawerOpen(false);
  }, [currentPage]);

  const showEnquireBtn = currentPage !== 'contact' && currentPage !== 'home';

  return (
    <>
      <EnquiryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Mobile Sticky Bottom CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] p-3 flex gap-3">
        <a
          href={`tel:${hotel.phoneTel}`}
          className="flex-1 flex justify-center items-center gap-2 bg-maroon-800 text-white font-medium py-3 rounded-lg shadow-sm"
        >
          <Phone className="w-4 h-4 fill-current" />
          <span className="text-sm">Call Now</span>
        </a>
        {showEnquireBtn ? (
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex-1 flex justify-center items-center gap-2 bg-gold-500 text-white font-medium py-3 rounded-lg shadow-sm"
          >
            <ClipboardList className="w-4 h-4" />
            <span className="text-sm">Enquire</span>
          </button>
        ) : (
          <a
            href={`https://wa.me/${hotel.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex justify-center items-center gap-2 bg-emerald-500 text-white font-medium py-3 rounded-lg shadow-sm"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="text-sm">WhatsApp</span>
          </a>
        )}
      </div>

      {/* Desktop Floating Actions */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-40 flex-col gap-3 items-center">
        {showEnquireBtn && (
          <motion.button
            onClick={() => setDrawerOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-12 h-12 bg-gold-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold-600 transition-transform hover:scale-105"
            aria-label="Quick Enquiry"
            title="Quick Enquiry"
          >
            <ClipboardList className="w-5 h-5" />
          </motion.button>
        )}
        <a
          href={`https://wa.me/${hotel.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-transform hover:scale-105"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>
        <a
          href={`tel:${hotel.phoneTel}`}
          className="w-12 h-12 bg-maroon-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-maroon-900 transition-transform hover:scale-105"
          aria-label="Call Hotel"
        >
          <Phone className="w-5 h-5 fill-current" />
        </a>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black mt-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
