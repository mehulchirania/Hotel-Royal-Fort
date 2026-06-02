import React, { createContext, useContext, useState } from 'react';

export type Page = 'home' | 'rooms' | 'amenities' | 'events' | 'dining' | 'gallery' | 'location' | 'contact';

interface NavContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
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
