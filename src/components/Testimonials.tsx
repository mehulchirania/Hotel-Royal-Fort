import React from 'react';
import { Star, Quote, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useNav } from '../context/nav';
import { hotel } from '../data/hotel';

export function Testimonials() {
  const { navigate } = useNav();

  const reviews = [
    {
      text: "Great central location in Ballari with clean, comfortable rooms, polite and helpful staff, and very good food served at the in-house restaurant.",
      author: "Umesh Chandra",
      type: "Google Review • Local Guide",
      rating: 5,
    },
    {
      text: "Good option for family stay and short business trips. Clean rooms, convenient access to the railway station, and tasty breakfast spread.",
      author: "Santhosh Kumar Yellarapu",
      type: "Google Review • Family Stay",
      rating: 5,
    },
    {
      text: "Very nice atmosphere, courteous room service, and delicious quality food. Highly recommended choice when visiting Ballari with family.",
      author: "Shobha S.",
      type: "Google Review • Verified Guest",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-maroon-50 text-maroon-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Google Maps Reviews
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold mb-4">Guest Experiences</h2>
          <p className="text-gray-600">See what recent travelers and guests say about their stay at Hotel Royal Fort, Ballari.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {reviews.map((review, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-maroon-100 opacity-50 pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-1 mb-6 text-gold-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 font-medium leading-relaxed mb-8">"{review.text}"</p>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                 <div className="w-10 h-10 brand-mark rounded-full flex items-center justify-center font-serif font-bold text-sm shadow-inner">
                   {review.author.charAt(0)}
                 </div>
                 <div>
                   <p className="text-sm font-bold text-gray-900 leading-tight">{review.author}</p>
                   <p className="text-xs text-gray-500 mt-0.5">{review.type}</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('reviews')}
            className="inline-flex items-center gap-2 bg-maroon-800 hover:bg-maroon-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-sm text-sm"
          >
            Read All Reviews ({hotel.reviewCount}+ Google Reviews)
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={hotel.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-xl transition-all text-sm"
          >
            View Google Maps Page
          </a>
        </div>
      </div>
    </section>
  );
}
