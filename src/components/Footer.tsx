import React from 'react';
import { Facebook, Instagram, Twitter, MapPin } from 'lucide-react';
import { hotel } from '../data/hotel';
import { NavLink, type Page } from '../context/nav';
import { legalDocs, legalDocOrder } from '../data/legal';
import { usePrivacy } from '../context/privacy';

export function Footer() {
  const { openLegal, openConsentSettings } = usePrivacy();

  const quickLinks: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Rooms & Tariffs', page: 'rooms' },
    { label: 'Amenities', page: 'amenities' },
    { label: 'Events & Banquets', page: 'events' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Guest Reviews', page: 'reviews' },
    { label: 'Contact Us', page: 'contact' },
  ];

  return (
    <footer className="site-footer py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">

          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 brand-mark rounded-lg flex items-center justify-center">
                <span className="font-serif text-xl font-bold">RF</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-white leading-none">Hotel Royal Fort</span>
                <span className="text-[10px] uppercase tracking-widest text-maroon-500 font-medium">Ballari</span>
              </div>
            </div>
            <p className="text-sm mb-6 leading-relaxed max-w-xs">
              Comfortable rooms, suite stays, banquet halls, and outdoor event space on New Trunk Road in Ballari.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full site-footer-chip flex items-center justify-center hover:bg-maroon-800 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full site-footer-chip flex items-center justify-center hover:bg-maroon-800 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full site-footer-chip flex items-center justify-center hover:bg-maroon-800 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <NavLink page={link.page} className="hover:text-gold-400 transition-colors text-left">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-2 text-sm">
              {legalDocOrder.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => openLegal(id)}
                    aria-haspopup="dialog"
                    className="hover:text-gold-400 transition-colors text-left"
                  >
                    {id === 'faq' ? 'FAQ' : legalDocs[id].title}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={openConsentSettings} className="hover:text-gold-400 transition-colors text-left">
                  Privacy settings
                </button>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed max-w-[28ch]">
              Privacy &amp; data requests: {hotel.dataContact.role},{' '}
              <a href={`mailto:${hotel.dataContact.email}`} className="underline hover:text-gold-400 break-all">
                {hotel.dataContact.email}
              </a>
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Location</h4>
            <div className="text-sm space-y-3">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-maroon-600 flex-shrink-0 mt-0.5" />
                {hotel.address}
              </p>
              <a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-gold-500 hover:text-gold-400 text-xs font-semibold uppercase tracking-wider transition-colors border-b border-gold-500/30 pb-0.5">
                Open in Google Maps
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t site-footer-rule text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>© 2026 Hotel Royal Fort, Ballari. All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
}
