import React, { useState } from 'react';
import { ExternalLink, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { hotel } from '../data/hotel';

const images = [
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Representative hotel exterior view', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-2' },
  { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Representative AC room interior', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Representative suite bedding', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Representative bathroom amenity view', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Representative front desk area', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Representative restaurant and lounge seating', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
];

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold mb-4">Hotel Gallery</h2>
          <p className="text-gray-600">Browse representative views for rooms and facilities, or open the Google Maps listing for the latest guest photos of Hotel Royal Fort.</p>
          <a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-5 bg-gray-900 text-white px-5 py-2.5 rounded-md font-medium hover:bg-black transition-colors">
            <ExternalLink className="w-4 h-4" />
            View Latest Google Photos
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px]">
          {images.map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-sm ${img.colSpan} ${img.rowSpan}`}
              onClick={() => setSelectedImage(img.url)}
            >
              <img 
                src={img.url} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/30 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-gray-900/95 flex items-center justify-center p-4"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-gray-800/50 hover:bg-gray-800 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage} 
              alt="Gallery Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
