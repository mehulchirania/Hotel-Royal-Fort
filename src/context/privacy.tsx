import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { legalDocs, type LegalDocId } from '../data/legal';
import { LegalModal } from '../components/LegalModal';

/**
 * Privacy state shared across the site: which legal document is open, and
 * whether the guest has agreed to optional analytics.
 *
 * Analytics is OFF until the guest opts in (DPDP Act 2023 / GDPR style
 * opt-in). The choice is kept in localStorage with a timestamp so it can be
 * re-asked after CONSENT_TTL_MS and withdrawn at any time from the footer.
 */
const CONSENT_KEY = 'rf_consent_v1';
const CONSENT_TTL_MS = 180 * 24 * 60 * 60 * 1000; // re-ask every ~6 months

export type AnalyticsConsent = 'granted' | 'denied' | null;

interface PrivacyContextValue {
  openLegal: (id: LegalDocId) => void;
  analytics: AnalyticsConsent;
  setAnalytics: (value: 'granted' | 'denied') => void;
  /** True while the banner should be on screen (no choice yet, or reopened). */
  bannerOpen: boolean;
  openConsentSettings: () => void;
}

const PrivacyContext = createContext<PrivacyContextValue | null>(null);

function readConsent(): AnalyticsConsent {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { analytics?: string; at?: number };
    if (!parsed.at || Date.now() - parsed.at > CONSENT_TTL_MS) return null;
    return parsed.analytics === 'granted' || parsed.analytics === 'denied'
      ? parsed.analytics
      : null;
  } catch {
    return null;
  }
}

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [openDoc, setOpenDoc] = useState<LegalDocId | null>(null);
  const [analytics, setAnalyticsState] = useState<AnalyticsConsent>(() => readConsent());
  const [reopened, setReopened] = useState(false);

  const setAnalytics = useCallback((value: 'granted' | 'denied') => {
    setAnalyticsState(value);
    setReopened(false);
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: value, at: Date.now() }));
      // Location permission was granted under the old analytics choice.
      if (value === 'denied') window.localStorage.removeItem('royalFortLocationConsent');
    } catch {
      /* storage blocked — the choice still holds for this page view */
    }
  }, []);

  const value = useMemo<PrivacyContextValue>(
    () => ({
      openLegal: setOpenDoc,
      analytics,
      setAnalytics,
      bannerOpen: analytics === null || reopened,
      openConsentSettings: () => setReopened(true),
    }),
    [analytics, reopened, setAnalytics],
  );

  return (
    <PrivacyContext.Provider value={value}>
      {children}
      <LegalModal doc={openDoc ? legalDocs[openDoc] : null} onClose={() => setOpenDoc(null)} />
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const ctx = useContext(PrivacyContext);
  if (!ctx) throw new Error('usePrivacy must be used within PrivacyProvider');
  return ctx;
}
