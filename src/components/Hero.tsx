import React from 'react';
import { Phone, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { hotel } from '../data/hotel';

export function Hero() {
  return (
    <section id="home" className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden bg-white">
      {/* Background abstract element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-maroon-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full text-center lg:text-left pt-8 lg:pt-0"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-500/10 text-gold-600 font-medium text-sm mb-6">
              <MapPin className="w-4 h-4" />
              <span>{hotel.shortAddress}</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-gray-900 leading-tight mb-6">
              Comfortable Stays <br className="hidden lg:block"/>
              in the <span className="text-maroon-800 relative whitespace-nowrap">
                Heart of Ballari
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold-500 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Hotel Royal Fort offers AC rooms and suites, warm hospitality, restaurant and lounge facilities, and convenient access for families, business travellers, and visitors to Ballari.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
              <a href="#quick-enquiry" className="bg-maroon-800 text-white px-8 py-3.5 rounded-md font-medium shadow-md hover:bg-maroon-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Book / Enquire Now
              </a>
              <a href="#rooms" className="text-maroon-800 bg-maroon-50 px-8 py-3.5 rounded-md font-medium hover:bg-maroon-100 transition-colors border border-maroon-100">
                View Rooms
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Family Friendly</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Business Centre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Restaurant & Lounge</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{hotel.rating} Google Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{hotel.category}</span>
              </div>
            </div>
            
            {/* Quick Contact Strip */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 border-t border-gray-100 pt-6">
               <a href={`tel:${hotel.phoneTel}`} className="flex items-center gap-2 text-gray-700 hover:text-maroon-800 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                 </div>
                 <span className="font-medium text-sm">Call Hotel</span>
               </a>
               <a href={`https://wa.me/${hotel.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                 </div>
                 <span className="font-medium text-sm">WhatsApp</span>
               </a>
               <a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                 </div>
                 <span className="font-medium text-sm">Directions</span>
               </a>
            </div>
            
          </motion.div>
          
          {/* Hero Image */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="flex-1 w-full"
          >
            <div className="relative aspect-[4/3] lg:aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Hotel Royal Fort Exterior and Reception" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white pointer-events-none">
                 <p className="font-serif text-2xl font-medium">Hotel Royal Fort</p>
                 <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
                   <MapPin className="w-3.5 h-3.5" />
                   {hotel.shortAddress}
                 </p>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute top-1/2 -left-6 md:-left-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden sm:block animate-bounce" style={{ animationDuration: '3s' }}>
               <div className="flex items-center gap-3">
                 <div className="bg-gold-50 w-12 h-12 rounded-full flex items-center justify-center text-gold-600">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                   </svg>
                 </div>
                 <div>
                   <p className="text-sm font-bold text-gray-900">{hotel.rating} Rating</p>
                   <p className="text-xs text-gray-500">{hotel.reviewCount} Google reviews</p>
                 </div>
               </div>
            </div>
            
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
