import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { NavProvider, useNav } from './context/nav';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EnquiryFormBar } from './components/EnquiryFormBar';
import { Rooms } from './components/Rooms';
import { Amenities } from './components/Amenities';
import { Events } from './components/Events';
import { Dining } from './components/Dining';
import { Gallery } from './components/Gallery';
import { Location } from './components/Location';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';

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
          </>
        )}
        {currentPage === 'rooms' && <div className="pt-4"><Rooms /></div>}
        {currentPage === 'amenities' && <div className="pt-4"><Amenities /></div>}
        {currentPage === 'events' && <div className="pt-4"><Events /></div>}
        {currentPage === 'dining' && <div className="pt-4"><Dining /></div>}
        {currentPage === 'gallery' && <div className="pt-4"><Gallery /></div>}
        {currentPage === 'location' && <div className="pt-4"><Location /></div>}
        {currentPage === 'contact' && <div className="pt-4"><Contact /></div>}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <NavProvider>
      <div className="font-sans antialiased text-gray-900 bg-gray-50 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pb-20 md:pb-0">
          <PageContent />
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </NavProvider>
  );
}
