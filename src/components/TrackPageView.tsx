'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface Props {
  eventName: string;
  params?: Record<string, unknown>;
}

/**
 * Drop this into any server-rendered page to fire a dataLayer event
 * once the component mounts on the client.
 */
export default function TrackPageView({ eventName, params }: Props) {
  useEffect(() => {
    trackEvent(eventName, params);
    // Only fire once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
