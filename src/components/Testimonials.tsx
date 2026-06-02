import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

export function Testimonials() {
  const reviews = [
    {
      text: "Clean rooms and good service. Comfortable stay in Ballari.",
      author: "Verified Guest",
      type: "Family Trip"
    },
    {
      text: "Helpful staff and convenient location. Easy access to main city areas.",
      author: "Verified Guest",
      type: "Business Stay"
    },
    {
      text: "Good option for family stay and short business trips. Recommend for a peaceful night.",
      author: "Verified Guest",
      type: "Solo Traveller"
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold mb-4">Guest Feedback</h2>
          <p className="text-gray-600">See what our guests say about their experience at Hotel Royal Fort.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-maroon-100 opacity-50" />
              
              <div className="flex items-center gap-1 mb-6 text-gold-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              
              <p className="text-gray-700 font-medium leading-loose mb-8">"{review.text}"</p>
              
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-maroon-800 rounded-full flex items-center justify-center text-white font-serif font-bold text-sm">
                   {review.author.charAt(0)}
                 </div>
                 <div>
                   <p className="text-sm font-bold text-gray-900">{review.author}</p>
                   <p className="text-xs text-gray-500">{review.type}</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
