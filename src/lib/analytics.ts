/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export function initDataLayer() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
}

/**
 * Push a custom event to the GTM dataLayer.
 * Safe to call on server (no-ops) and before GTM loads
 * (events are queued and replayed when GTM initialises).
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

/** Helpers for common events used across the site */
export const track = {
  articleRead: (slug: string, title: string) =>
    trackEvent('article_read', { content_slug: slug, content_title: title }),

  thinkerViewed: (slug: string, name: string) =>
    trackEvent('thinker_viewed', { thinker_slug: slug, thinker_name: name }),

  resourceClicked: (title: string, url: string) =>
    trackEvent('resource_clicked', { resource_title: title, resource_url: url }),

  shareClicked: (platform: string, contentSlug: string) =>
    trackEvent('share_clicked', { platform, content_slug: contentSlug }),
};
