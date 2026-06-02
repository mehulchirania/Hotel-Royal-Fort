import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { hotel } from '../data/hotel';
import { useNav, type Page } from '../context/nav';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPage, navigate } = useNav();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; page: Page }[] = [
    { name: 'Home', page: 'home' },
    { name: 'Rooms', page: 'rooms' },
    { name: 'Amenities', page: 'amenities' },
    { name: 'Events', page: 'events' },
    { name: 'Gallery', page: 'gallery' },
    { name: 'Dining', page: 'dining' },
    { name: 'Location', page: 'location' },
    { name: 'Contact', page: 'contact' },
  ];

  const handleNav = (page: Page) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm shadow-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button onClick={() => handleNav('home')} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-maroon-800 rounded-lg flex items-center justify-center">
                <span className="text-gold-500 font-serif text-xl font-bold">RF</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-xl font-bold text-gray-900 leading-none">Hotel Royal Fort</span>
                <span className="text-[10px] uppercase tracking-widest text-maroon-700 font-medium">Ballari</span>
              </div>
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNav(link.page)}
                className={`font-medium text-sm transition-colors ${
                  currentPage === link.page
                    ? 'text-maroon-800 border-b-2 border-maroon-800 pb-0.5'
                    : 'text-gray-600 hover:text-maroon-800'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer" className="hidden xl:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-maroon-800">
              <MapPin className="w-4 h-4 text-maroon-700" />
              Directions
            </a>
            <a href={`https://wa.me/${hotel.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-md transition-colors">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <a href={`tel:${hotel.phoneTel}`} className="flex items-center gap-1.5 bg-maroon-800 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-maroon-700 transition-colors shadow-sm">
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-maroon-800 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 shadow-inner">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.page)}
                  className={`w-full text-left block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    currentPage === link.page
                      ? 'text-maroon-800 bg-maroon-50'
                      : 'text-gray-800 hover:text-maroon-800 hover:bg-maroon-50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <div className="mt-6 space-y-3 px-3">
                <a href={`tel:${hotel.phoneTel}`} className="w-full flex items-center justify-center gap-2 bg-maroon-800 text-white px-4 py-3 text-base font-medium rounded-md shadow-sm">
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
                <a href={`https://wa.me/${hotel.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-3 text-base font-medium rounded-md">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Enquiry
                </a>
                <a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-3 text-base font-medium rounded-md">
                  <MapPin className="w-5 h-5" />
                  Get Directions
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
