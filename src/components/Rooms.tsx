import React from 'react';
import { ExternalLink, Wifi, Wind, Tv, Coffee, Bath, BedDouble } from 'lucide-react';
import { motion } from 'motion/react';
import { hotel } from '../data/hotel';
import { useNav } from '../context/nav';
import { Img } from './Img';
import type { ImageName } from '../data/images.generated';

interface Room {
  title: string;
  description: string;
  image: ImageName;
  accent: string;
  tag: string;
  directBooking?: boolean;
}

const rooms: Room[] = [
  {
    title: 'Chief AC Room',
    description: 'A practical air-conditioned room for solo travellers and short stays, with clean essentials and easy service access.',
    image: 'hotel-room',
    accent: 'bg-blue-500',
    tag: 'Standard',
  },
  {
    title: 'Deluxe AC Room',
    description: 'A roomier air-conditioned option for couples and business guests looking for extra comfort during a Ballari stay.',
    image: 'hotel-room',
    accent: 'bg-emerald-500',
    tag: 'Popular',
  },
  {
    title: 'Suite Room',
    description: 'A premium suite option for guests who want extra room, comfort, and privacy during their stay.',
    image: 'hotel-room',
    accent: 'bg-amber-500',
    tag: 'Premium',
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

export function Rooms() {
  const { navigate } = useNav();

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
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full group"
            >
              {/* Colour accent strip */}
              <div className={`h-1.5 ${room.accent}`} />

              <div className="relative h-56 overflow-hidden bg-gray-100">
                <Img
                  name={room.image}
                  alt={room.title}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Scrim keeps both pills legible whatever the photo behind them. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 via-black/15 to-transparent pointer-events-none"
                />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                  <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${room.accent}`} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
                    {room.tag}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-maroon-800 rounded-full shadow-sm">
                  {room.directBooking ? 'Direct booking' : 'Goibibo live booking'}
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

                {room.directBooking ? (
                  <button
                    onClick={() => navigate('contact')}
                    className="w-full py-3 px-4 bg-maroon-50 text-maroon-800 font-semibold rounded-md border border-maroon-100 flex items-center justify-center gap-2 hover:bg-maroon-800 hover:text-white transition-colors group/btn"
                  >
                    Enquire for Suite Room
                    <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                ) : (
                  <a
                    href={hotel.goibiboUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-maroon-50 text-maroon-800 font-semibold rounded-md border border-maroon-100 flex items-center justify-center gap-2 hover:bg-maroon-800 hover:text-white transition-colors group/btn"
                  >
                    Book on Goibibo
                    <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                )}
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
