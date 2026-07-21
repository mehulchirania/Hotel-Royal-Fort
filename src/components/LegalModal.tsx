import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import type { LegalDoc } from '../data/legal';

interface LegalModalProps {
  doc: LegalDoc | null;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const EXIT_MS = 200;

export function LegalModal({ doc, onClose }: LegalModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Remember what the guest was on so focus can go back when the dialog closes.
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const exitTimer = useRef<number | undefined>(undefined);
  const [closing, setClosing] = useState(false);

  /**
   * Presence is driven by `doc` alone rather than by AnimatePresence's exit
   * bookkeeping — when that failed to unmount, the invisible full-screen
   * backdrop stayed behind and swallowed every click on the page.
   */
  const requestClose = useCallback(() => {
    setClosing(true);
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, EXIT_MS);
  }, [onClose]);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  useEffect(() => {
    if (!doc) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    // Lock background scroll without the layout shifting as the bar disappears.
    const { body } = document;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

    panelRef.current?.focus();

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      restoreFocusRef.current?.focus?.();
    };
  }, [doc]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        requestClose();
        return;
      }
      if (e.key !== 'Tab') return;

      // Keep tabbing inside the dialog while it is open.
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [requestClose]
  );

  if (!doc) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <div
        onClick={requestClose}
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={closing ? { opacity: 0, y: 24, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="min-w-0">
            <h2
              id="legal-modal-title"
              className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-tight"
            >
              {doc.title}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Last updated {doc.updated}</p>
          </div>
          <button
            onClick={requestClose}
            aria-label="Close"
            className="flex-shrink-0 p-2 -mr-2 -mt-1 rounded-lg text-gray-500 hover:text-maroon-800 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 sm:px-8 py-6 flex-1">
          <p className="text-sm text-gray-600 leading-relaxed mb-7">{doc.intro}</p>

          <div className="space-y-7">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{section.heading}</h3>
                {section.body && (
                  <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
                )}
                {section.bullets && (
                  <ul className="mt-2 space-y-2">
                    {section.bullets.map((point) => (
                      <li key={point} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
                        <span
                          aria-hidden="true"
                          className="mt-[0.55rem] w-1 h-1 rounded-full bg-gold-500 flex-shrink-0"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-maroon-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={requestClose}
            className="bg-maroon-800 hover:bg-maroon-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
