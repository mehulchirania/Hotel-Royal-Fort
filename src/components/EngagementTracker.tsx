import React, { useEffect, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useNav } from '../context/nav';
import { usePrivacy } from '../context/privacy';
import {
  deleteEngagementVisit,
  recordEngagementLocation,
  recordEngagementPage,
  startEngagementVisit,
} from '../lib/engagement';

const LOCATION_CONSENT_KEY = 'royalFortLocationConsent';

type LocationConsent = 'granted' | 'denied' | null;

function getStoredConsent(): LocationConsent {
  const stored = window.localStorage.getItem(LOCATION_CONSENT_KEY);
  return stored === 'granted' || stored === 'denied' ? stored : null;
}

function getLocationStatus(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) return 'denied';
  if (error.code === error.POSITION_UNAVAILABLE) return 'unavailable';
  return 'error';
}

export function EngagementTracker() {
  const { currentPage } = useNav();
  const { analytics } = usePrivacy();
  const [visitId, setVisitId] = useState<string | null>(null);
  const [locationConsent, setLocationConsent] = useState<LocationConsent>(() => getStoredConsent());
  const [requestingLocation, setRequestingLocation] = useState(false);
  const lastRecordedPage = useRef(currentPage);

  // Nothing is sent until the guest has accepted analytics. Withdrawing
  // consent deletes the visit record that was already stored.
  useEffect(() => {
    if (analytics !== 'granted') return;
    let cancelled = false;

    startEngagementVisit(currentPage).then((id) => {
      if (!cancelled) setVisitId(id);
    });

    return () => {
      cancelled = true;
    };
  }, [analytics]);

  useEffect(() => {
    if (analytics !== 'denied' || !visitId) return;
    void deleteEngagementVisit(visitId);
    setVisitId(null);
  }, [analytics, visitId]);

  useEffect(() => {
    if (!visitId || lastRecordedPage.current === currentPage) return;
    lastRecordedPage.current = currentPage;
    void recordEngagementPage(visitId, currentPage);
  }, [currentPage, visitId]);

  useEffect(() => {
    if (!visitId || locationConsent !== 'granted') return;
    requestPreciseLocation(false);
  }, [locationConsent, visitId]);

  const requestPreciseLocation = (fromClick = true) => {
    if (!visitId || requestingLocation) return;

    if (!navigator.geolocation) {
      void recordEngagementLocation(visitId, { status: 'unsupported' });
      setLocationConsent('denied');
      window.localStorage.setItem(LOCATION_CONSENT_KEY, 'denied');
      return;
    }

    if (fromClick) {
      setLocationConsent('granted');
      window.localStorage.setItem(LOCATION_CONSENT_KEY, 'granted');
    }

    setRequestingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRequestingLocation(false);
        void recordEngagementLocation(visitId, {
          status: 'granted',
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy),
        });
      },
      (error) => {
        const status = getLocationStatus(error);
        setRequestingLocation(false);
        setLocationConsent(status === 'denied' ? 'denied' : null);
        if (status === 'denied') {
          window.localStorage.setItem(LOCATION_CONSENT_KEY, 'denied');
        }
        void recordEngagementLocation(visitId, { status });
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 30 * 60 * 1000,
      },
    );
  };

  const declineLocation = () => {
    setLocationConsent('denied');
    window.localStorage.setItem(LOCATION_CONSENT_KEY, 'denied');
    if (visitId) void recordEngagementLocation(visitId, { status: 'denied' });
  };

  const shouldShowPrompt = analytics === 'granted' && visitId && locationConsent === null;

  return (
    <AnimatePresence>
      {shouldShowPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed left-4 right-4 bottom-24 md:left-6 md:right-auto md:bottom-6 md:w-[360px] z-50 rounded-lg border border-gray-200 bg-white shadow-xl p-4"
          role="dialog"
          aria-live="polite"
          aria-label="Location sharing"
        >
          <button
            onClick={declineLocation}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
            aria-label="Close location request"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex gap-3 pr-6">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon-50 text-maroon-800">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Share your location?</p>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                Hotel Royal Fort uses this only to understand where website visitors are browsing from.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => requestPreciseLocation()}
                  disabled={requestingLocation}
                  className="rounded-md bg-maroon-800 px-3 py-2 text-xs font-semibold text-white hover:bg-maroon-900 disabled:cursor-wait disabled:opacity-70"
                >
                  {requestingLocation ? 'Requesting...' : 'Allow'}
                </button>
                <button
                  onClick={declineLocation}
                  className="rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
