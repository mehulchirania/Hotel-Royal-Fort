import type { Page } from '../context/nav';

type EngagementVisitPayload = {
  landingPath: string;
  currentPage: Page;
  referrer: string;
  timezone: string;
  language: string;
  languages: string[];
  platform: string;
  screen: string;
  viewport: string;
  devicePixelRatio: number;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connectionType?: string;
  touchSupport: boolean;
  userAgent: string;
  locationStatus: string;
  utm: {
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
  };
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    type?: string;
  };
};

let visitRequest: Promise<string | null> | null = null;

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
    term: params.get('utm_term') || '',
    content: params.get('utm_content') || '',
  };
}

function buildVisitPayload(currentPage: Page): EngagementVisitPayload {
  const nav = navigator as NavigatorWithHints;
  const connectionType = nav.connection?.effectiveType || nav.connection?.type || '';

  return {
    landingPath: `${window.location.pathname}${window.location.search}`,
    currentPage,
    referrer: document.referrer,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    language: navigator.language,
    languages: Array.from(navigator.languages || []),
    platform: navigator.platform,
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio || 1,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    connectionType,
    touchSupport: navigator.maxTouchPoints > 0,
    userAgent: navigator.userAgent,
    locationStatus: 'not_requested',
    utm: getUtmParams(),
  };
}

export async function startEngagementVisit(currentPage: Page) {
  if (visitRequest) return visitRequest;

  visitRequest = fetch('/api/engagement/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildVisitPayload(currentPage)),
    keepalive: true,
  })
    .then(async (response) => {
      if (!response.ok) return null;
      const data = await response.json();
      return typeof data.visitId === 'string' ? data.visitId : null;
    })
    .catch(() => null);

  return visitRequest;
}

export function recordEngagementPage(visitId: string, page: Page) {
  return fetch('/api/engagement/page', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitId, page }),
    keepalive: true,
  }).catch(() => undefined);
}

export function recordEngagementLocation(
  visitId: string,
  payload: {
    status: 'granted' | 'denied' | 'unavailable' | 'error' | 'unsupported';
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  },
) {
  return fetch('/api/engagement/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitId, ...payload }),
    keepalive: true,
  }).catch(() => undefined);
}
