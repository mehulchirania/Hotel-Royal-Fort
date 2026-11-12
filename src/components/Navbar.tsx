import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, MapPin, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { hotel } from '../data/hotel';
import { useNav, NavLink, type Page } from '../context/nav';
import { useTheme } from '../context/theme';

/** Sun/moon swap that rotates and fades rather than popping between glyphs. */
function ThemeIcon({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <span className="relative block w-5 h-5">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPage, navigate } = useNav();
  const { theme, toggleTheme } = useTheme();

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
    { name: 'Reviews', page: 'reviews' },
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
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-2'
          : 'bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-6 lg:gap-10">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink page="home" aria-label="Hotel Royal Fort, home" onNavigate={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 brand-mark rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="font-serif text-xl font-bold">RF</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-xl font-bold text-gray-900 leading-none whitespace-nowrap">Hotel Royal Fort</span>
                <span className="text-[10px] uppercase tracking-widest text-maroon-700 font-medium mt-0.5">Ballari</span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Nav */}
          {/* Nine links only fit from lg up — below that they were being
              silently clipped by the body's overflow-x:hidden. */}
          <nav className="hidden lg:flex items-center gap-x-4 xl:gap-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                page={link.page}
                /* border-b-2 lives on every state so the active link does not
                   nudge the row by 2px when it changes */
                className={`relative font-medium text-sm whitespace-nowrap pb-1 border-b-2 transition-colors ${
                  currentPage === link.page
                    ? 'text-maroon-800 border-maroon-800'
                    : 'text-gray-600 border-transparent hover:text-maroon-800 hover:border-maroon-100'
                }`}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-maroon-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              <ThemeIcon theme={theme} />
            </button>

            <a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer" className="hidden 2xl:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-maroon-800 transition-colors">
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

          {/* Compact group for everything below xl. The toggle stays reachable
              at every width; the hamburger only appears once the nav collapses. */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-maroon-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              <ThemeIcon theme={theme} />
            </button>

            <button
              type="button"
              className="lg:hidden text-gray-600 hover:text-maroon-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-expanded={mobileMenuOpen}
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
            className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 shadow-inner">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  page={link.page}
                  onNavigate={() => setMobileMenuOpen(false)}
                  className={`w-full text-left block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    currentPage === link.page
                      ? 'text-maroon-800 bg-maroon-50'
                      : 'text-gray-800 hover:text-maroon-800 hover:bg-maroon-50'
                  }`}
                >
                  {link.name}
                </NavLink>
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
