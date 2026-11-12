import React, { useState } from 'react';
import { Star, Quote, ExternalLink, ThumbsUp, MapPin, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { motion } from 'motion/react';
import { hotel } from '../data/hotel';

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  category: 'family' | 'business' | 'dining' | 'location' | 'general';
  categoryLabel: string;
  text: string;
  badge?: string;
  helpfulCount?: number;
  verified?: boolean;
}

export const googleReviews: ReviewItem[] = [
  {
    id: '1',
    author: 'Umesh Chandra',
    rating: 5,
    date: 'Google Review',
    category: 'general',
    categoryLabel: 'General Stay',
    text: 'Great central location in Ballari with clean, comfortable rooms, polite and helpful staff, and very good food served at the in-house restaurant.',
    badge: 'Local Guide',
    helpfulCount: 14,
    verified: true,
  },
  {
    id: '2',
    author: 'Santhosh Kumar Yellarapu',
    rating: 5,
    date: 'Google Review',
    category: 'family',
    categoryLabel: 'Family Stay',
    text: 'Good option for family stay and short business trips. Clean rooms, convenient access to the railway station, and tasty breakfast spread.',
    badge: 'Verified Guest',
    helpfulCount: 9,
    verified: true,
  },
  {
    id: '3',
    author: 'Shobha S.',
    rating: 5,
    date: 'Google Review',
    category: 'family',
    categoryLabel: 'Family Vacation',
    text: 'Very nice atmosphere, courteous room service, and delicious quality food. Highly recommended choice when visiting Ballari with family.',
    badge: 'Verified Guest',
    helpfulCount: 11,
    verified: true,
  },
  {
    id: '4',
    author: 'Abhinav Appa Rao Guttikonda',
    rating: 5,
    date: 'Google Review',
    category: 'location',
    categoryLabel: 'Location & View',
    text: 'Excellent view of Ballari Fort nearby, ample car parking space, and supportive hotel staff. Convenient location right on New Trunk Road.',
    badge: 'Local Guide',
    helpfulCount: 18,
    verified: true,
  },
  {
    id: '5',
    author: 'Subhajeet Sarkar',
    rating: 4,
    date: 'Google Review',
    category: 'business',
    categoryLabel: 'Business Stay',
    text: 'Comfortable stay right in the heart of the city. Good room amenities, polite staff, and smooth check-in process.',
    badge: 'Verified Guest',
    helpfulCount: 7,
    verified: true,
  },
  {
    id: '6',
    author: 'Rajesh Kumar',
    rating: 5,
    date: 'Google Review',
    category: 'dining',
    categoryLabel: 'Dining & Events',
    text: 'Spacious AC rooms, excellent banquet hall facilities for functions, and convenient location near main city centers. The food served was very fresh.',
    badge: 'Local Guide',
    helpfulCount: 15,
    verified: true,
  },
  {
    id: '7',
    author: 'Praveen V.',
    rating: 5,
    date: 'Google Review',
    category: 'location',
    categoryLabel: 'Location & Service',
    text: 'Prime location in Bellary with ample parking and polite staff behavior. Tasty food options and hassle-free stay experience.',
    badge: 'Verified Guest',
    helpfulCount: 6,
    verified: true,
  },
];

export function Reviews() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Reviews' },
    { key: 'family', label: 'Family Stays' },
    { key: 'business', label: 'Business Trips' },
    { key: 'location', label: 'Location & Views' },
    { key: 'dining', label: 'Dining & Food' },
  ];

  const filteredReviews = activeCategory === 'all' 
    ? googleReviews 
    : googleReviews.filter(r => r.category === activeCategory);

  // Avatar background colors for variety
  const avatarColors = [
    'bg-maroon-800 text-gold-400',
    'bg-amber-800 text-amber-100',
    'bg-emerald-800 text-emerald-100',
    'bg-slate-800 text-slate-100',
    'bg-indigo-900 text-indigo-100',
    'bg-rose-900 text-rose-100',
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 border border-gold-500/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                <MapPin className="w-3.5 h-3.5" />
                Google Maps Verified Reviews
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Guest Reviews & Experiences
              </h1>
              <p className="text-maroon-100 text-base sm:text-lg leading-relaxed">
                Read authentic guest feedback from travelers, business guests, and families who stayed at Hotel Royal Fort, Ballari.
              </p>
            </div>

            {/* Google Rating Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center flex-shrink-0 min-w-[240px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl font-bold text-white font-serif">{hotel.rating}</span>
                <div className="flex text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gold-200 font-medium mb-4">
                Based on {hotel.reviewCount}+ Google Reviews
              </p>
              <a
                href={hotel.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-maroon-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-md text-sm"
              >
                View on Google Maps
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Location & Access</p>
            <p className="text-2xl font-serif font-bold text-maroon-800">4.5 / 5</p>
            <p className="text-xs text-gray-400 mt-1">Near Railway & City Center</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Food & Dining</p>
            <p className="text-2xl font-serif font-bold text-maroon-800">4.3 / 5</p>
            <p className="text-xs text-gray-400 mt-1">In-house Restaurant</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Parking & Area</p>
            <p className="text-2xl font-serif font-bold text-maroon-800">4.6 / 5</p>
            <p className="text-xs text-gray-400 mt-1">Ample On-site Parking</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Staff Hospitality</p>
            <p className="text-2xl font-serif font-bold text-maroon-800">4.2 / 5</p>
            <p className="text-xs text-gray-400 mt-1">Courteous Service</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.key
                  ? 'bg-maroon-800 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review, idx) => {
            const avatarBg = avatarColors[idx % avatarColors.length];
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-2xl p-7 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative"
              >
                <div>
                  {/* Top Bar: Stars & Category.
                      The chip must not shrink or wrap — long labels like
                      "Location & Service" otherwise collapse mid-word. */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-1 text-gold-500 flex-shrink-0 pt-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="flex-shrink-0 whitespace-nowrap text-[11px] font-semibold text-gray-600 bg-gray-100 border border-gray-200/70 px-2.5 py-1 rounded-full">
                      {review.categoryLabel}
                    </span>
                  </div>

                  {/* Review Text. The quote mark is an inline accent rather than
                      an absolutely-positioned watermark, which used to overlap
                      the category chip in the top-right corner. */}
                  <Quote className="w-6 h-6 text-maroon-800/15 mb-2" aria-hidden="true" />
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base font-normal mb-6">
                    {review.text}
                  </p>
                </div>

                {/* Reviewer Details Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm font-serif shadow-inner ${avatarBg}`}>
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">
                          {review.author}
                        </h4>
                        {review.verified && (
                          <span title="Verified Reviewer"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" aria-label="Verified Reviewer" /></span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-500">{review.date}</span>
                        {review.badge && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-[11px] font-medium text-maroon-700">{review.badge}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {review.helpfulCount && (
                    <div className="flex items-center gap-1 text-xs text-gray-400" title="Helpful votes">
                      <ThumbsUp className="w-3 h-3 text-gray-400" />
                      <span>{review.helpfulCount}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Google Maps Call to Action Footer */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 bg-maroon-100 text-maroon-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Have you stayed at Hotel Royal Fort?
          </h3>
          <p className="text-gray-600 text-sm mb-6 max-w-xl mx-auto">
            We value your feedback! Share your experience on Google Maps to help other travelers discover Hotel Royal Fort in Ballari.
          </p>
          <a
            href={hotel.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-maroon-800 hover:bg-maroon-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-sm text-sm"
          >
            Write a Review on Google Maps
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
