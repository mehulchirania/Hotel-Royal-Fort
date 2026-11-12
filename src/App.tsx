import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { NavProvider, NavLink, useNav, type Page } from './context/nav';
import { PrivacyProvider } from './context/privacy';
import { hotel } from './data/hotel';
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
import { ConsentBanner } from './components/ConsentBanner';

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
  notfound: 'Page not found',
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

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">That page isn&apos;t here.</h1>
      <p className="text-gray-600 max-w-xl mb-8">
        The address may have changed. Start from the home page or call the front desk on {hotel.phoneDisplay}.
      </p>
      <NavLink page="home" className="inline-block bg-maroon-800 text-white font-medium px-6 py-3 rounded-md hover:bg-maroon-700 transition-colors">
        Back to Hotel Royal Fort
      </NavLink>
    </div>
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
        {currentPage === 'notfound' && <NotFound />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavProvider>
        <PrivacyProvider>
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
            <ConsentBanner />
          </div>
        </PrivacyProvider>
      </NavProvider>
    </ThemeProvider>
  );
}
