import React from 'react';
import { Wind, Wifi, BedDouble, Droplets, UtensilsCrossed, Car, Users, Briefcase, KeyRound, Coffee, Tv, Sparkles, Trees } from 'lucide-react';
import { motion } from 'motion/react';
import { hotel } from '../data/hotel';

const groups = [
  {
    category: 'Room & In-Room',
    items: [
      { icon: <Wind className="w-5 h-5" />, title: 'Air Conditioning' },
      { icon: <Wifi className="w-5 h-5" />, title: 'Wi-Fi' },
      { icon: <Tv className="w-5 h-5" />, title: 'TV' },
      { icon: <BedDouble className="w-5 h-5" />, title: 'Comfortable Bed' },
      { icon: <Droplets className="w-5 h-5" />, title: 'Geyser / Hot Water' },
      { icon: <Sparkles className="w-5 h-5" />, title: 'Housekeeping' },
    ],
  },
  {
    category: 'Food & Drink',
    items: [
      { icon: <UtensilsCrossed className="w-5 h-5" />, title: 'Restaurant' },
      { icon: <Coffee className="w-5 h-5" />, title: 'Lounge & Bar' },
      { icon: <UtensilsCrossed className="w-5 h-5" />, title: 'Room Service' },
    ],
  },
  {
    category: 'Events & Business',
    items: [
      { icon: <Users className="w-5 h-5" />, title: '3 Banquet Halls' },
      { icon: <Trees className="w-5 h-5" />, title: 'Outdoor Event Area' },
      { icon: <Briefcase className="w-5 h-5" />, title: 'Business Centre' },
    ],
  },
  {
    category: 'Services',
    items: [
      { icon: <Car className="w-5 h-5" />, title: 'Free Parking' },
      { icon: <KeyRound className="w-5 h-5" />, title: 'Power Backup' },
      { icon: <Users className="w-5 h-5" />, title: 'Concierge' },
      { icon: <BedDouble className="w-5 h-5" />, title: 'Luggage Assistance' },
      { icon: <Car className="w-5 h-5" />, title: 'Railway / Bus Transfers' },
      { icon: <Sparkles className="w-5 h-5" />, title: 'Spa' },
    ],
  },
];

export function Amenities() {
  return (
    <section id="amenities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold mb-4">Amenities & Facilities</h1>
          <p className="text-gray-600">Listing amenities include {hotel.amenities.slice(0, 6).join(', ')}, and more guest services for a comfortable stay.</p>
        </div>

        <div className="space-y-10">
          {groups.map((group, gIdx) => (
            <div key={group.category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-maroon-700 mb-4 pl-1">{group.category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {group.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, delay: (gIdx * group.items.length + idx) * 0.03 }}
                    className="group bg-gray-50 border border-gray-100 p-4 rounded-xl text-center hover:bg-white hover:border-maroon-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="inline-flex items-center justify-center p-2.5 rounded-full bg-white text-maroon-800 shadow-sm mb-3 group-hover:bg-maroon-50 transition-all">
                      {item.icon}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">{item.title}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          * Facilities may vary by room type. Please contact the front desk for specific requests.
        </p>
      </div>
    </section>
  );
}
