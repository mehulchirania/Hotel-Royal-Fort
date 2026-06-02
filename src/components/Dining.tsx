import React from 'react';
import { Coffee, MapPin, ConciergeBell } from 'lucide-react';
import { motion } from 'motion/react';
import { hotel } from '../data/hotel';

export function Dining() {
  const options = [
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Restaurant',
      description: 'The hotel listing includes an in-house restaurant for convenient dining during your stay.'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Lounge & Bar',
      description: 'Lounge and bar facilities are listed for guests who want an easy place to unwind without leaving the property.'
    },
    {
      icon: <ConciergeBell className="w-6 h-6" />,
      title: 'Room Service Support',
      description: 'Room service and nearby food access make quick meals simple around New Trunk Road and Siddartha Nagar.'
    }
  ];

  return (
    <section id="dining" className="py-20 bg-maroon-900 border-t border-maroon-800 relative z-10">
      {/* Texture/Pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          <div className="flex-1 text-center lg:text-left">
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold mb-6">Dining & Food Options</h2>
            <p className="text-maroon-100/90 text-lg mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Enjoy convenient food options during your stay. Hotel Royal Fort's listing includes a restaurant, lounge, bar, and room service, with local restaurants nearby around {hotel.shortAddress}.
            </p>
            
            <div className="grid gap-6">
              {options.map((option, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-maroon-800/80 backdrop-blur-sm p-6 rounded-xl border border-maroon-700/50 flex gap-4 text-left"
                >
                  <div className="flex-shrink-0 mt-1 text-gold-500">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">{option.title}</h3>
                    <p className="text-maroon-100/80 text-sm leading-relaxed">{option.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Hotel Dining Area" 
                className="w-full h-full object-cover aspect-square lg:aspect-[4/5] opacity-90"
              />
              <div className="absolute inset-0 border-4 border-gold-500/20 rounded-2xl m-3 pointer-events-none"></div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
