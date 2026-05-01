'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface ConsentState {
  analytics: boolean;
  social: boolean;
}

interface CookieConsentProps {
  bannerText?: string;
  privacyUrl?: string;
}

const COOKIE_NAME = 'cookie_consent';
const COOKIE_DAYS = 365;

function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]+)/);
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match[1])); }
  catch { return null; }
}

function writeConsent(state: ConsentState) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(state))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  window.dispatchEvent(new Event('cookieConsentUpdated'));
}

export default function CookieConsent({
  bannerText = 'We use cookies to analyse traffic and improve your experience.',
  privacyUrl = '/privacy-policy',
}: CookieConsentProps) {
  const [show, setShow]           = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs]         = useState<ConsentState>({ analytics: false, social: false });

  useEffect(() => {
    if (readConsent() === null) setShow(true);

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
    setShow(false); setShowModal(false);
  }, []);

  const rejectAll = useCallback(() => {
    writeConsent({ analytics: false, social: false });
    setShow(false); setShowModal(false);
  }, []);

  const savePrefs = useCallback(() => {
    writeConsent(prefs);
    setShow(false); setShowModal(false);
  }, [prefs]);

  const openModal = useCallback(() => {
    setPrefs(readConsent() ?? { analytics: false, social: false });
    setShowModal(true);
  }, []);

  const toggleCls = (on: boolean) =>
    `shrink-0 mt-0.5 w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${on ? 'bg-[#E24B4A]' : 'bg-zinc-200'}`;

  return (
    <>
      {/* Bottom banner */}
      {show && !showModal && (
        <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 inset-x-0 z-[100] bg-white" style={{ borderTop: '0.5px solid #E4E4E7' }}>
          <div className="max-w-wide mx-auto px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-[0.8rem] text-zinc-600 flex-1 leading-relaxed">
              {bannerText}{' '}
              <Link href={privacyUrl} className="text-[#E24B4A] underline hover:text-[#C73B3A]">Privacy Policy</Link>
            </p>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button onClick={openModal} className="px-4 py-1.5 text-[0.775rem] font-medium text-zinc-600 border border-zinc-200 rounded hover:border-zinc-400 transition-colors">
                Manage Preferences
              </button>
              <button onClick={rejectAll} className="px-4 py-1.5 text-[0.775rem] font-medium text-zinc-600 border border-zinc-200 rounded hover:bg-zinc-50 transition-colors">
                Reject All
              </button>
              <button onClick={acceptAll} className="px-4 py-1.5 text-[0.775rem] font-medium bg-[#E24B4A] hover:bg-[#C73B3A] text-white rounded transition-colors">
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} aria-hidden="true" />

          <div className="relative bg-white border border-zinc-200 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '0.5px solid #E4E4E7' }}>
              <h2 className="text-[0.9375rem] font-medium text-zinc-900">Cookie Preferences</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Necessary */}
              <div className="flex items-start justify-between gap-4 pb-4" style={{ borderBottom: '0.5px solid #F4F4F5' }}>
                <div>
                  <p className="text-[0.8125rem] font-medium text-zinc-900">Necessary</p>
                  <p className="text-[0.73rem] text-zinc-400 mt-0.5 leading-relaxed">Required for the site to function. Always active.</p>
                </div>
                <div className="shrink-0 mt-0.5 w-9 h-5 bg-zinc-200 rounded-full flex items-center px-0.5">
                  <div className="w-4 h-4 bg-zinc-400 rounded-full ml-auto" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 pb-4" style={{ borderBottom: '0.5px solid #F4F4F5' }}>
                <div>
                  <p className="text-[0.8125rem] font-medium text-zinc-900">Analytics</p>
                  <p className="text-[0.73rem] text-zinc-400 mt-0.5 leading-relaxed">Google Analytics (via GTM) — helps us understand how visitors use the site.</p>
                </div>
                <button role="switch" aria-checked={prefs.analytics} onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))} className={toggleCls(prefs.analytics)}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${prefs.analytics ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Social */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.8125rem] font-medium text-zinc-900">Social Media</p>
                  <p className="text-[0.73rem] text-zinc-400 mt-0.5 leading-relaxed">Enables share buttons (Twitter/X, Facebook, LinkedIn). Platforms may set their own cookies.</p>
                </div>
                <button role="switch" aria-checked={prefs.social} onClick={() => setPrefs(p => ({ ...p, social: !p.social }))} className={toggleCls(prefs.social)}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${prefs.social ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="px-5 py-4 space-y-2" style={{ borderTop: '0.5px solid #E4E4E7' }}>
              <div className="flex gap-2">
                <button onClick={rejectAll} className="flex-1 px-4 py-1.5 text-[0.775rem] font-medium border border-zinc-200 rounded hover:bg-zinc-50 transition-colors">Reject All</button>
                <button onClick={acceptAll} className="flex-1 px-4 py-1.5 text-[0.775rem] font-medium border border-zinc-200 rounded hover:bg-zinc-50 transition-colors">Accept All</button>
              </div>
              <button onClick={savePrefs} className="w-full px-4 py-1.5 text-[0.775rem] font-medium bg-[#E24B4A] hover:bg-[#C73B3A] text-white rounded transition-colors">
                Save My Preferences
              </button>
              <p className="text-[0.68rem] text-zinc-400 text-center">
                <Link href={privacyUrl} className="underline hover:text-zinc-600">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
