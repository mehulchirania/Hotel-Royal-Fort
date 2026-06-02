import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export function Location() {
  const highlights = [
    'Ballari Fort',
    'Local markets & shopping areas',
    'Railway station & bus connectivity',
    'Key business areas',
    'Temples and local landmarks',
    'Popular food spots'
  ];

  return (
    <section id="location" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold mb-4">Explore Ballari from Hotel Royal Fort</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Situated conveniently in Ballari, our hotel provides easy connectivity to major transport hubs and local attractions, making it perfect for both sightseeing and business commitments.
            </p>
            
            <ul className="space-y-4 mb-8">
              {highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 text-gold-600">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <a 
              href="https://maps.app.goo.gl/vVGSAApmL79wqteK8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-black transition-colors shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              Open in Google Maps
            </a>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 order-1 lg:order-2 h-[400px] lg:h-[500px] w-full bg-gray-200 rounded-2xl overflow-hidden relative shadow-lg border border-gray-100"
          >
            <iframe 
               src="https://maps.google.com/maps?q=Hotel%20Royal%20Fort%20Bellary&t=&z=15&ie=UTF8&iwloc=&output=embed" 
               width="100%" 
               height="100%"
               style={{border: 0}}
               allowFullScreen={true}
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
