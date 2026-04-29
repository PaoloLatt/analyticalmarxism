'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { initDataLayer } from '@/lib/analytics';

function getAnalyticsConsent(): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]+)/);
  if (!match) return false;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return parsed?.analytics === true;
  } catch {
    return false;
  }
}

export default function GTMScript() {
  const [hasConsent, setHasConsent] = useState(false);
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    // Initialise the dataLayer queue regardless of consent so
    // pre-consent pushes are not lost.
    initDataLayer();

    function syncConsent() {
      setHasConsent(getAnalyticsConsent());
    }

    syncConsent();

    // Re-check when the consent banner fires its update event (Phase 3).
    window.addEventListener('cookieConsentUpdated', syncConsent);
    return () => window.removeEventListener('cookieConsentUpdated', syncConsent);
  }, []);

  if (!hasConsent || !gtmId) return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
        }}
      />
      {/* GTM noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
