import React, { createContext, useContext, useEffect, useState } from 'react';
import seo from '../data/seo-pages.json';

export type Page =
  | 'home'
  | 'rooms'
  | 'amenities'
  | 'events'
  | 'dining'
  | 'gallery'
  | 'reviews'
  | 'location'
  | 'contact'
  | 'notfound';

type RealPage = Exclude<Page, 'notfound'>;
const VALID_PAGES = Object.keys(seo.pages) as RealPage[];

/** Real, crawlable URL for a page: /rooms, /dining, ... (home is /). */
export function pagePath(page: Page): string {
  return page === 'notfound' ? '/' : seo.pages[page].path;
}

function pageFromLocation(): Page {
  // Old links used /?page=rooms; they resolve to the same page, and the
  // server 301s them to /rooms for crawlers.
  const legacy = new URLSearchParams(window.location.search).get('page') as RealPage | null;
  if (legacy && VALID_PAGES.includes(legacy)) return legacy;

  const path = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
  const match = VALID_PAGES.find((p) => seo.pages[p].path === path);
  return match ?? 'notfound';
}

function setMeta(selector: string, attr: string, value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value);
}

/** Keeps title, description, canonical and share tags in step on client navigation. */
function applySeo(page: Page) {
  if (page === 'notfound') {
    document.title = 'Page not found | Hotel Royal Fort';
    return;
  }
  const { title, description, path } = seo.pages[page];
  const url = `${seo.siteUrl}${path === '/' ? '/' : path}`;
  document.title = title;
  setMeta('meta[name="description"]', 'content', description);
  setMeta('link[rel="canonical"]', 'href', url);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:url"]', 'content', url);
  setMeta('meta[name="twitter:title"]', 'content', title);
  setMeta('meta[name="twitter:description"]', 'content', description);
}

interface NavContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>(pageFromLocation);

  // Tidy a legacy ?page= address into its clean path.
  useEffect(() => {
    if (window.location.search.includes('page=') && currentPage !== 'notfound') {
      window.history.replaceState({}, '', pagePath(currentPage));
    }
  }, []);

  useEffect(() => {
    const onPop = () => setCurrentPage(pageFromLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => applySeo(currentPage), [currentPage]);

  const navigate = (page: Page) => {
    if (page !== currentPage) window.history.pushState({}, '', pagePath(page));
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return <NavContext.Provider value={{ currentPage, navigate }}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}

type NavLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  page: Page;
  /** Runs after an in-app navigation (e.g. close a menu). */
  onNavigate?: () => void;
};

/**
 * A real <a href="/rooms">: crawlers and "open in new tab" get a genuine URL,
 * while an ordinary click navigates in-app without a reload.
 */
export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { page, onNavigate, onClick, ...rest },
  ref,
) {
  const { navigate } = useNav();
  return (
    <a
      ref={ref}
      href={pagePath(page)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(page);
        onNavigate?.();
      }}
      {...rest}
    />
  );
});
