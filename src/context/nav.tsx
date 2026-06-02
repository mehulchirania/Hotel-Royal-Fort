import React, { createContext, useContext, useState } from 'react';

export type Page = 'home' | 'rooms' | 'amenities' | 'events' | 'dining' | 'gallery' | 'location' | 'contact';

const VALID_PAGES: Page[] = ['home', 'rooms', 'amenities', 'events', 'dining', 'gallery', 'location', 'contact'];

function getInitialPage(): Page {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('page') as Page | null;
  return p && VALID_PAGES.includes(p) ? p : 'home';
}

interface NavContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
    const url = page === 'home'
      ? window.location.pathname
      : `${window.location.pathname}?page=${page}`;
    window.history.replaceState({}, '', url);
  };

  return (
    <NavContext.Provider value={{ currentPage, navigate }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
