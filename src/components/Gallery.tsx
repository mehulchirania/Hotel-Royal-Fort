import React, { useEffect, useState } from 'react';
import { ExternalLink, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { hotel } from '../data/hotel';
import { Img } from './Img';
import { images as imageAssets, type ImageName } from '../data/images.generated';

const tiles: { name: ImageName; alt: string; colSpan: string; rowSpan: string }[] = [
  { name: 'hotel-exterior', alt: 'Representative hotel exterior view', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-2' },
  { name: 'hotel-room', alt: 'Representative AC room interior', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { name: 'hotel-room', alt: 'Representative suite bedding', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { name: 'hotel-lobby-dining', alt: 'Representative front desk area', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { name: 'hotel-exterior', alt: 'Representative hotel approach view', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { name: 'hotel-lobby-dining', alt: 'Representative restaurant and lounge seating', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
];

export function Gallery() {
  const [selected, setSelected] = useState<{ name: ImageName; alt: string } | null>(null);

  // Escape closes the lightbox, and the page behind it must not scroll.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

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
          {tiles.map((tile, idx) => (
            <motion.button
              key={idx}
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-sm bg-gray-100 ${tile.colSpan} ${tile.rowSpan}`}
              onClick={() => setSelected({ name: tile.name, alt: tile.alt })}
              aria-label={`Enlarge: ${tile.alt}`}
            >
              <Img
                name={tile.name}
                alt={tile.alt}
                sizes="(min-width: 768px) 50vw, 50vw"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/30 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={selected.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] bg-gray-900/95 flex items-center justify-center p-4"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(null); }}
              aria-label="Close image"
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-gray-800/50 hover:bg-gray-800 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={imageAssets[selected.name].src}
              srcSet={imageAssets[selected.name].srcSet}
              sizes="100vw"
              alt={selected.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
