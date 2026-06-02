import React from 'react';
import { BedDouble, Users, Map, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export function Features() {
  const reasons = [
    {
      title: 'Clean & Comfortable Rooms',
      icon: <BedDouble className="w-6 h-6 text-maroon-800" />
    },
    {
      title: 'Helpful Staff',
      icon: <Users className="w-6 h-6 text-maroon-800" />
    },
    {
      title: 'Good City Access',
      icon: <Map className="w-6 h-6 text-maroon-800" />
    },
    {
      title: 'Suitable for Families & Business',
      icon: <CheckCircle2 className="w-6 h-6 text-maroon-800" />
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-maroon-50 rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-sm border border-maroon-100 relative overflow-hidden">
          
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gold-400 opacity-10 rounded-br-full"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-maroon-800 opacity-5 rounded-tl-full"></div>

          <div className="relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold mb-4">
              Why Guests Choose <span className="text-maroon-800">Hotel Royal Fort</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
              A practical and comfortable stay experience in Ballari with the convenience our guests need.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {reasons.map((reason, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 bg-maroon-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-maroon-800 group-hover:text-white transition-colors duration-300">
                    <div className="group-hover:text-white transition-colors duration-300">
                      {reason.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-snug">{reason.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
