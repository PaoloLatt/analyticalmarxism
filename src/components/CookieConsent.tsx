'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface ConsentState {
  analytics: boolean;
  social: boolean;
}

const COOKIE_NAME = 'cookie_consent';
const COOKIE_DAYS = 365;

function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function writeConsent(state: ConsentState) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(state))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  // Notify GTMScript and other listeners
  window.dispatchEvent(new Event('cookieConsentUpdated'));
}

export default function CookieConsent() {
  const [show, setShow]           = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs]         = useState<ConsentState>({ analytics: false, social: false });

  useEffect(() => {
    // Show banner only if no consent cookie exists yet
    if (readConsent() === null) setShow(true);

    // "Cookie Settings" buttons in Footer open the modal
    function handleOpen() { setShowModal(true); }
    document.getElementById('open-cookie-settings')?.addEventListener('click', handleOpen);
    document.getElementById('open-cookie-settings-bottom')?.addEventListener('click', handleOpen);
    return () => {
      document.getElementById('open-cookie-settings')?.removeEventListener('click', handleOpen);
      document.getElementById('open-cookie-settings-bottom')?.removeEventListener('click', handleOpen);
    };
  }, []);

  const acceptAll = useCallback(() => {
    writeConsent({ analytics: true, social: true });
    setShow(false);
    setShowModal(false);
  }, []);

  const rejectAll = useCallback(() => {
    writeConsent({ analytics: false, social: false });
    setShow(false);
    setShowModal(false);
  }, []);

  const savePrefs = useCallback(() => {
    writeConsent(prefs);
    setShow(false);
    setShowModal(false);
  }, [prefs]);

  const openModal = useCallback(() => {
    const current = readConsent();
    setPrefs(current ?? { analytics: false, social: false });
    setShowModal(true);
  }, []);

  return (
    <>
      {/* ── Bottom banner ── */}
      {show && !showModal && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 inset-x-0 z-[100] border-t border-sand bg-cream shadow-xl"
        >
          <div className="max-w-wide mx-auto px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-[0.8rem] text-slate flex-1 leading-relaxed">
              We use cookies to analyse traffic and improve your experience.{' '}
              <Link href="/privacy-policy" className="text-burgundy-600 underline hover:text-burgundy-500">
                Privacy Policy
              </Link>
            </p>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={openModal}
                className="px-4 py-2 text-[0.78rem] font-medium text-slate border border-sand rounded hover:border-burgundy-300 hover:text-burgundy-600 transition-colors"
              >
                Manage Preferences
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-[0.78rem] font-medium text-slate border border-sand rounded hover:bg-parchment transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-[0.78rem] font-medium bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preferences modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/50"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          />

          <div className="relative bg-cream border border-sand rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-sand">
              <h2 className="font-serif text-[1.05rem] font-semibold text-charcoal">
                Cookie Preferences
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-muted hover:text-charcoal transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Categories */}
            <div className="px-5 py-4 space-y-4">
              {/* Necessary — always on */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-sand/60">
                <div>
                  <p className="text-[0.85rem] font-semibold text-charcoal">Necessary</p>
                  <p className="text-[0.75rem] text-muted mt-0.5 leading-relaxed">
                    Required for the site to function. Always active.
                  </p>
                </div>
                <div className="shrink-0 mt-0.5">
                  <div className="w-10 h-5 bg-burgundy-200 rounded-full flex items-center px-0.5">
                    <div className="w-4 h-4 bg-burgundy-400 rounded-full ml-auto" />
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-sand/60">
                <div>
                  <p className="text-[0.85rem] font-semibold text-charcoal">Analytics</p>
                  <p className="text-[0.75rem] text-muted mt-0.5 leading-relaxed">
                    Google Analytics (via GTM) — helps us understand how visitors
                    use the site. No personally identifiable data is stored.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={prefs.analytics}
                  onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                  className={`shrink-0 mt-0.5 w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                    prefs.analytics ? 'bg-burgundy-600' : 'bg-sand'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      prefs.analytics ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Social */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.85rem] font-semibold text-charcoal">Social Media</p>
                  <p className="text-[0.75rem] text-muted mt-0.5 leading-relaxed">
                    Enables social sharing buttons and embeds (Twitter/X,
                    Facebook, LinkedIn). These platforms may set their own cookies.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={prefs.social}
                  onClick={() => setPrefs((p) => ({ ...p, social: !p.social }))}
                  className={`shrink-0 mt-0.5 w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                    prefs.social ? 'bg-burgundy-600' : 'bg-sand'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      prefs.social ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-sand flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={rejectAll}
                  className="flex-1 px-4 py-2 text-[0.78rem] font-medium border border-sand rounded hover:bg-parchment transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2 text-[0.78rem] font-medium border border-sand rounded hover:bg-parchment transition-colors"
                >
                  Accept All
                </button>
              </div>
              <button
                onClick={savePrefs}
                className="w-full px-4 py-2 text-[0.78rem] font-medium bg-burgundy-600 hover:bg-burgundy-500 text-cream rounded transition-colors"
              >
                Save My Preferences
              </button>
              <p className="text-[0.7rem] text-muted text-center mt-1">
                <Link href="/privacy-policy" className="underline hover:text-charcoal">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
