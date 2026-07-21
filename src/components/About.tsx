import React from 'react';
import { ShieldCheck, Map, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';
import { hotel } from '../data/hotel';
import { useNav } from '../context/nav';
import { Img } from './Img';

export function About() {
  const { navigate } = useNav();
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-gold-500" />,
      title: 'AC Rooms & Suites',
      description: 'Chief AC Rooms, King Suites, Queen Suites, and Viceroy Suites for different stay needs.'
    },
    {
      icon: <Map className="w-8 h-8 text-gold-500" />,
      title: 'Verified Maps Location',
      description: `Located at ${hotel.shortAddress}, with quick access to transport, business areas, and city attractions.`
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-gold-500" />,
      title: 'Warm Hospitality',
      description: 'Restaurant, lounge, bar, room service, transfers, and front-desk assistance for travellers.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                About <span className="text-maroon-800">Hotel Royal Fort</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Hotel Royal Fort in Ballari is designed for guests who want a comfortable, convenient stay near the city's transport and business routes. The listing highlights AC rooms and suites, restaurant and lounge facilities, parking, Wi-Fi, room service, and helpful guest support at {hotel.shortAddress}.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex-shrink-0 mt-1 bg-maroon-50 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => navigate('contact')} className="inline-block border-2 border-maroon-800 text-maroon-800 font-medium px-8 py-3 rounded-md hover:bg-maroon-800 hover:text-white transition-colors">
               Contact Us Today
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative grid grid-cols-2 gap-4"
          >
            <Img
              name="hotel-lobby-dining"
              alt="Hotel Reception"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="col-span-2 w-full h-64 object-cover rounded-2xl shadow-lg"
            />
            <Img
              name="hotel-room"
              alt="Comfortable Room"
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="w-full h-48 object-cover rounded-2xl shadow-lg"
            />
            <Img
              name="hotel-exterior"
              alt="Cozy Details"
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="w-full h-48 object-cover rounded-2xl shadow-lg"
            />
            {/* Design accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-400 rounded-full blur-3xl opacity-20 -z-10"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
