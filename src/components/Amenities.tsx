import React from 'react';
import { Wind, Wifi, BedDouble, Droplets, UtensilsCrossed, Car, Users, Briefcase, KeyRound, Coffee, Tv, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function Amenities() {
  const amenitiesList = [
    { icon: <Wind className="w-6 h-6" />, title: 'Air-Conditioned Rooms' },
    { icon: <Wifi className="w-6 h-6" />, title: 'Free high-speed Wi-Fi' },
    { icon: <BedDouble className="w-6 h-6" />, title: 'Comfortable Beds' },
    { icon: <Droplets className="w-6 h-6" />, title: 'Clean & Hygienic Bathrooms' },
    { icon: <UtensilsCrossed className="w-6 h-6" />, title: 'Room Service Available' },
    { icon: <Car className="w-6 h-6" />, title: 'Parking Availability' },
    { icon: <Users className="w-6 h-6" />, title: 'Family-Friendly Stay' },
    { icon: <Briefcase className="w-6 h-6" />, title: 'Business Traveller Friendly' },
    { icon: <KeyRound className="w-6 h-6" />, title: '24/7 Front Desk Assistance' },
    { icon: <Coffee className="w-6 h-6" />, title: 'Hot Water Supply' },
    { icon: <Tv className="w-6 h-6" />, title: 'Television / Entertainment' },
    { icon: <Sparkles className="w-6 h-6" />, title: 'Daily Housekeeping' },
  ];

  return (
    <section id="amenities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold mb-4">Amenities & Facilities</h2>
          <p className="text-gray-600">Everything you need for a comfortable, stress-free stay.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {amenitiesList.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group bg-gray-50 border border-gray-100 p-6 rounded-xl text-center hover:bg-white hover:border-maroon-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-white text-maroon-800 shadow-sm mb-4 group-hover:scale-110 group-hover:bg-maroon-50 group-hover:text-maroon-900 transition-all">
                {item.icon}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">{item.title}</h3>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-10">
          * Facilities may vary by room type. Please contact the front desk for specific requests.
        </p>
      </div>
    </section>
  );
}
