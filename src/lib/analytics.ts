declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

function basePageParams(): EventParams {
  if (typeof window === 'undefined') return {};
  return {
    page_path: window.location.pathname,
    page_title: document.title || undefined,
  };
}

/**
 * Sends a GA4-compatible event. Uses gtag directly (already loaded via CookieConsent
 * after analytics consent); also mirrors to dataLayer in GTM's event format so the
 * same call works unmodified if a GTM container is added later.
 */
export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return;

  const merged = { ...basePageParams(), ...params };
  const cleanParams = Object.fromEntries(
    Object.entries(merged).filter(([, value]) => value !== undefined),
  );

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, cleanParams);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...cleanParams });
  }
}

export function trackPhoneClick(params: EventParams = {}) {
  trackEvent('phone_click', params);
}

export function trackWhatsAppClick(params: EventParams = {}) {
  trackEvent('whatsapp_click', params);
}

export function trackContactClick(params: EventParams = {}) {
  trackEvent('contact_click', params);
}

export function trackContactPageView(params: EventParams = {}) {
  trackEvent('contact_page_view', params);
}

export function trackLeadSubmit(params: EventParams = {}) {
  trackEvent('lead_submit', params);
}

export function trackPurchase(params: EventParams & { value?: number; currency?: string; transaction_id?: string } = {}) {
  trackEvent('purchase', params);
}
