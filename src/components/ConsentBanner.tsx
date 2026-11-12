import React from 'react';
import { usePrivacy } from '../context/privacy';

/**
 * Storage and analytics notice. "Reject" is as prominent as "Accept"; nothing
 * optional runs until the guest accepts. The site itself sets no cookies — only
 * a theme preference in localStorage, which is strictly necessary for display.
 */
export function ConsentBanner() {
  const { bannerOpen, setAnalytics, openLegal } = usePrivacy();

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Privacy and cookies"
      className="fixed left-4 right-4 bottom-24 md:left-6 md:right-auto md:bottom-6 md:w-[400px] z-[80] rounded-lg border border-gray-200 bg-white shadow-xl p-4"
    >
      <p className="text-sm font-semibold text-gray-900">Your privacy</p>
      <p className="mt-1 text-xs leading-5 text-gray-600">
        This site stores a theme preference on your device (essential). With your permission, we
        also record anonymous visit data — pages viewed and device type — to improve the site. If
        you are under 18, please ask a parent or guardian before accepting.{' '}
        <button type="button" onClick={() => openLegal('cookies')} className="font-medium text-maroon-800 underline">
          Cookie notice
        </button>{' '}
        ·{' '}
        <button type="button" onClick={() => openLegal('privacy')} className="font-medium text-maroon-800 underline">
          Privacy Policy
        </button>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setAnalytics('denied')}
          className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => setAnalytics('granted')}
          className="flex-1 rounded-md bg-maroon-800 px-3 py-2 text-xs font-semibold text-white hover:bg-maroon-900"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
