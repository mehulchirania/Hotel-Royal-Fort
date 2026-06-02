import React from 'react';
import { ExternalLink, Wifi, Wind, Tv, Coffee, Bath, BedDouble } from 'lucide-react';
import { motion } from 'motion/react';
import { hotel } from '../data/hotel';

export function Rooms() {
  const rooms = [
    {
      title: 'Chief AC Room',
      description: 'A practical air-conditioned room for solo travellers and short stays, with clean essentials and easy service access.',
      image: '/images/hotel-room.png',
    },
    {
      title: 'Deluxe AC Room',
      description: 'A roomier air-conditioned option for couples and business guests looking for extra comfort during a Ballari stay.',
      image: '/images/hotel-room.png',
    },
    {
      title: 'Suite Room',
      description: 'A premium suite option for guests who want extra room, comfort, and privacy during their stay.',
      image: '/images/hotel-room.png',
      directBooking: true,
    },
  ];

  const amenities = [
    { icon: <Wind className="w-4 h-4" />, label: 'AC' },
    { icon: <Wifi className="w-4 h-4" />, label: 'Wi-Fi' },
    { icon: <BedDouble className="w-4 h-4" />, label: 'Comfortable Bed' },
    { icon: <Tv className="w-4 h-4" />, label: 'TV' },
    { icon: <Bath className="w-4 h-4" />, label: 'Attached Bath' },
    { icon: <Coffee className="w-4 h-4" />, label: 'Room Service' },
  ];

  return (
    <section id="rooms" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold mb-4">Rooms Designed for Comfort</h2>
          <p className="text-gray-600">Choose from {hotel.roomTypes.join(', ')} with AC comfort, in-room essentials, and Goibibo booking support.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full group"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-maroon-800 rounded-full shadow-sm">
                  Goibibo live booking
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{room.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{room.description}</p>
                <div className="mb-6 space-y-3">
                  {hotel.goibiboRates.filter((rate) => rate.room === room.title).map((rate) => (
                    <div key={`${rate.room}-${rate.plan}`} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{rate.plan}</p>
                          {rate.originalPrice && (
                            <p className="text-xs text-gray-500 line-through mt-1">{rate.originalPrice}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-maroon-800">{rate.displayPrice}</p>
                          <p className="text-xs text-gray-500">{rate.taxes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-8 pt-6 border-t border-gray-100">
                  {amenities.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <div className="text-gold-600">{item.icon}</div>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                
                <a 
                  href={room.directBooking ? '#quick-enquiry' : hotel.goibiboUrl}
                  target={room.directBooking ? undefined : '_blank'}
                  rel={room.directBooking ? undefined : 'noopener noreferrer'}
                  className="w-full py-3 px-4 bg-maroon-50 text-maroon-800 font-semibold rounded-md border border-maroon-100 flex items-center justify-center gap-2 hover:bg-maroon-800 hover:text-white transition-colors group/btn"
                >
                  {room.directBooking ? 'Enquire for Suite Room' : 'Book on Goibibo'}
                  <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-8">
          Goibibo prices can change by date, occupancy, taxes, and offers. Suite tariff is listed as Rs. 5,500 + taxes for direct enquiries.
        </p>
      </div>
    </section>
  );
}
