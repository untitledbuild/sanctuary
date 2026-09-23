/**
 * Bridges the Usercentrics CMP's consent decision into Google Consent Mode
 * v2, and only injects GA4/GTM once analytics consent is actually granted.
 *
 * BaseLayout.astro sets the Consent Mode default to fully denied, before this
 * module (and before Usercentrics) ever runs, so if Usercentrics fails to
 * load at all (network block, ad blocker, script error) the fallback is
 * "never track" rather than "track anyway" - this fails closed, not open.
 *
 * `ad_storage` / `ad_user_data` / `ad_personalization` are never granted here:
 * nothing in this codebase runs Google Ads or remarketing, so there's no
 * consented purpose to grant them for. Only `analytics_storage` moves.
 *
 * This depends on Usercentrics' documented v2 CMP browser API (`UC_UI`, the
 * `UC_UI_INITIALIZED` / `UC_UI_VIEW_CHANGED` document events, and
 * `getServicesBaseInfo()`), and matches the Google Analytics / Google Tag
 * Manager services by name containing "google" - Usercentrics' own template
 * catalog names both that way by default. If this account's dashboard has
 * those services under different names, or a newer Usercentrics SDK changes
 * this API, the match below silently finds nothing and consent stays denied
 * (fails closed) rather than granting incorrectly - safe, but worth
 * confirming against the actual configured service names.
 *
 * Usercentrics may also offer a native "Google Consent Mode" auto-integration
 * per service in its dashboard, which does this same `gtag('consent',
 * 'update', ...)` call without any custom code. If that's enabled on this
 * account, this module's updates are redundant with it, not conflicting -
 * both just push the same consent state.
 */
const GA_MEASUREMENT_ID = 'G-F3PMRFPQ0G';
const GTM_CONTAINER_ID = 'GTM-W6342TDT';

interface UcServiceConsent {
  name?: string;
  consent?: { status?: boolean };
}
interface UcUi {
  getServicesBaseInfo?: () => UcServiceConsent[];
}
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    UC_UI?: UcUi;
  }
}

let googleTagsLoaded = false;

/** Injects gtag.js and the GTM container script. Idempotent, and only ever
 *  called after analytics consent has been granted. */
function loadGoogleTags(): void {
  if (googleTagsLoaded) return;
  googleTagsLoaded = true;

  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gtagScript);
  window.gtag?.('js', new Date());
  window.gtag?.('config', GA_MEASUREMENT_ID);

  (function (w: Window, d: Document, s: string, l: string, i: string) {
    const dl = (w as Window & Record<string, unknown[]>)[l] ?? [];
    (w as Window & Record<string, unknown[]>)[l] = dl;
    dl.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s) as HTMLScriptElement;
    const dlParam = l !== 'dataLayer' ? `&l=${l}` : '';
    j.async = true;
    j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dlParam}`;
    f.parentNode?.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GTM_CONTAINER_ID);
}

function updateConsent(analyticsGranted: boolean): void {
  window.gtag?.('consent', 'update', {
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  if (analyticsGranted) loadGoogleTags();
}

function syncFromUsercentrics(): void {
  const services = window.UC_UI?.getServicesBaseInfo?.();
  if (!services) return;
  try {
    const granted = services.some(
      (s) => /google/i.test(s.name ?? '') && s.consent?.status === true,
    );
    updateConsent(granted);
  } catch (err) {
    console.error('[consent] failed to read Usercentrics consent:', err);
  }
}

document.addEventListener('UC_UI_INITIALIZED', syncFromUsercentrics);
document.addEventListener('UC_UI_VIEW_CHANGED', syncFromUsercentrics);

export {};
