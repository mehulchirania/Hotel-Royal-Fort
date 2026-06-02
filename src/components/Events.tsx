import React from 'react';
import { Building2, CalendarCheck, Trees, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { hotel } from '../data/hotel';
import { useNav } from '../context/nav';

const icons = [
  <Building2 className="w-6 h-6" />,
  <Trees className="w-6 h-6" />,
  <CalendarCheck className="w-6 h-6" />,
];

export function Events() {
  const { navigate } = useNav();
  return (
    <section id="events" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-maroon-50 text-maroon-800 font-semibold text-sm mb-5">
              <Users className="w-4 h-4" />
              Events & Celebrations
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold mb-5">
              Banquet Halls & Outdoor Event Space
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Hotel Royal Fort offers 3 banquet halls for event bookings, with an additional outdoor area for larger gatherings, dining setups, and celebrations.
            </p>

            <div className="grid gap-4">
              {hotel.eventSpaces.map((space, idx) => (
                <motion.div
                  key={space.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5"
                >
                  <div className="flex-shrink-0 text-gold-600 bg-white rounded-lg p-3 shadow-sm">
                    {icons[idx]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{space.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{space.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => navigate('contact')}
              className="inline-flex items-center justify-center mt-8 bg-maroon-800 text-white px-7 py-3 rounded-md font-medium hover:bg-maroon-700 transition-colors shadow-sm"
            >
              Enquire for Event Booking
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          >
            <img
              src="/images/hotel-lobby-dining.png"
              alt="Hotel Royal Fort banquet and event space"
              className="w-full h-full object-cover aspect-[4/3]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/80 to-transparent p-6 text-white">
              <p className="font-serif text-2xl font-semibold">3 Banquet Halls</p>
              <p className="text-sm text-white/85 mt-1">Indoor halls with additional outdoor area</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
