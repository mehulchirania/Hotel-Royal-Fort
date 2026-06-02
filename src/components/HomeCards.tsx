import React from 'react';
import { BedDouble, Sparkles, Users, UtensilsCrossed, Image, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNav, type Page } from '../context/nav';

const sections = [
  {
    page: 'rooms' as Page,
    label: 'Rooms & Tariffs',
    description: 'Chief AC, Deluxe AC, and Suite rooms with live Goibibo pricing.',
    icon: <BedDouble className="w-6 h-6" />,
    accent: 'from-blue-50 to-indigo-50 border-blue-100',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    page: 'amenities' as Page,
    label: 'Amenities',
    description: 'Wi-Fi, parking, spa, restaurant, business centre, and more.',
    icon: <Sparkles className="w-6 h-6" />,
    accent: 'from-amber-50 to-yellow-50 border-amber-100',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    page: 'events' as Page,
    label: 'Events & Banquets',
    description: '3 banquet halls and outdoor space for celebrations and gatherings.',
    icon: <Users className="w-6 h-6" />,
    accent: 'from-maroon-50 to-rose-50 border-maroon-100',
    iconBg: 'bg-maroon-100 text-maroon-700',
  },
  {
    page: 'dining' as Page,
    label: 'Dining',
    description: 'In-house restaurant, lounge, bar, and room service.',
    icon: <UtensilsCrossed className="w-6 h-6" />,
    accent: 'from-emerald-50 to-teal-50 border-emerald-100',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    page: 'gallery' as Page,
    label: 'Gallery',
    description: 'Browse hotel photos and representative room views.',
    icon: <Image className="w-6 h-6" />,
    accent: 'from-purple-50 to-violet-50 border-purple-100',
    iconBg: 'bg-purple-100 text-purple-700',
  },
  {
    page: 'location' as Page,
    label: 'Location & Directions',
    description: 'New Trunk Road, Siddartha Nagar — map and nearby landmarks.',
    icon: <MapPin className="w-6 h-6" />,
    accent: 'from-gray-50 to-slate-50 border-gray-200',
    iconBg: 'bg-gray-200 text-gray-700',
  },
];

export function HomeCards() {
  const { navigate } = useNav();

  return (
    <section className="py-14 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8 text-center">Explore the Hotel</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s, idx) => (
            <motion.button
              key={s.page}
              onClick={() => navigate(s.page)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className={`group w-full text-left bg-gradient-to-br ${s.accent} border rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex-shrink-0 w-11 h-11 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  {s.icon}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors mt-1 flex-shrink-0" />
              </div>
              <h3 className="font-bold text-gray-900 mt-3 mb-1">{s.label}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
