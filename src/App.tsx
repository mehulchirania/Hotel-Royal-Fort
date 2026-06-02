import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EnquiryFormBar } from './components/EnquiryFormBar';
import { About } from './components/About';
import { Rooms } from './components/Rooms';
import { Amenities } from './components/Amenities';
import { Dining } from './components/Dining';
import { Gallery } from './components/Gallery';
import { Features } from './components/Features';
import { Location } from './components/Location';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';

export default function App() {
  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 flex flex-col min-h-screen scroll-smooth">
      <Navbar />
      <main className="flex-grow pb-20 md:pb-0">
        <Hero />
        <EnquiryFormBar />
        <About />
        <Rooms />
        <Amenities />
        <Dining />
        <Gallery />
        <Features />
        <Location />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
