import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { NavProvider, useNav, type Page } from './context/nav';
import { ThemeProvider } from './context/theme';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EnquiryFormBar } from './components/EnquiryFormBar';
import { HomeCards } from './components/HomeCards';
import { Testimonials } from './components/Testimonials';
import { Rooms } from './components/Rooms';
import { Amenities } from './components/Amenities';
import { Events } from './components/Events';
import { Dining } from './components/Dining';
import { Gallery } from './components/Gallery';
import { Reviews } from './components/Reviews';
import { Location } from './components/Location';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { EngagementTracker } from './components/EngagementTracker';

const PAGE_LABELS: Record<Page, string> = {
  home: 'Home',
  rooms: 'Rooms & Tariffs',
  amenities: 'Amenities',
  events: 'Events & Banquets',
  dining: 'Dining',
  gallery: 'Gallery',
  reviews: 'Guest Reviews',
  location: 'Location',
  contact: 'Contact',
};

function PageBreadcrumb() {
  const { currentPage, navigate } = useNav();
  if (currentPage === 'home') return null;
  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1 text-gray-600 hover:text-maroon-800 transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>
        <span aria-hidden="true" className="text-gray-400">/</span>
        <span aria-current="page" className="text-gray-900 font-semibold">{PAGE_LABELS[currentPage]}</span>
      </div>
    </nav>
  );
}

function PageContent() {
  const { currentPage } = useNav();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {currentPage === 'home' && (
          <>
            <Hero />
            <EnquiryFormBar />
            <HomeCards />
            <Testimonials />
          </>
        )}
        {currentPage === 'rooms' && <Rooms />}
        {currentPage === 'amenities' && <Amenities />}
        {currentPage === 'events' && <Events />}
        {currentPage === 'dining' && <Dining />}
        {currentPage === 'gallery' && <Gallery />}
        {currentPage === 'reviews' && <Reviews />}
        {currentPage === 'location' && <Location />}
        {currentPage === 'contact' && <Contact />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavProvider>
        <div className="font-sans antialiased text-gray-900 bg-gray-50 flex flex-col min-h-screen">
          <Navbar />
          {/* Matches the unscrolled header: 40px logo + 2×16px padding + 1px border */}
          <div className="pt-[73px]">
            <PageBreadcrumb />
            <main className="flex-grow pb-20 md:pb-0">
              <PageContent />
            </main>
            <Footer />
          </div>
          <FloatingActions />
          <EngagementTracker />
        </div>
      </NavProvider>
    </ThemeProvider>
  );
}
