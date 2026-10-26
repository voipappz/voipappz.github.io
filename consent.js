// Google Analytics 4 with Google Consent Mode v2 and a cookie banner.
// Analytics cookies stay off until the visitor accepts; the choice is kept in localStorage.
(() => {
  const GA_ID = 'G-Z0TM7QEJ6W';
  const KEY = 'va-consent';
  const VERSION = 1;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };

  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (saved && saved.v !== VERSION) saved = null;
  const granted = saved && saved.analytics === true;

  gtag('consent', 'default', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(tag);

  const save = (analytics) => {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, analytics, at: new Date().toISOString() })); } catch (e) {}
    gtag('consent', 'update', { analytics_storage: analytics ? 'granted' : 'denied' });
    if (!analytics) {
      // Remove analytics cookies already set on this domain.
      document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^_ga/.test(n)).forEach((n) => {
        const host = location.hostname;
        [host, '.' + host, '.' + host.split('.').slice(-2).join('.')].forEach((d) => {
          document.cookie = n + '=; Max-Age=0; path=/; domain=' + d;
        });
        document.cookie = n + '=; Max-Age=0; path=/';
      });
    }
  };

  const css = `
  .va-consent{position:fixed;z-index:100;left:.75rem;right:.75rem;bottom:.75rem;max-width:24rem;background:#fff;color:#000;border:2.5px solid #000;border-radius:1.5rem;box-shadow:5px 5px 0 0 #000;padding:1rem 1.125rem;font:500 .875rem/1.45 var(--font-body,Poppins,system-ui,sans-serif)}
    .va-consent p{margin:0}
  .va-consent a{color:inherit;text-decoration:underline;text-underline-offset:2px}
  .va-consent .va-row{display:flex;gap:.625rem;margin-top:.75rem}
  .va-consent button{flex:1;min-height:44px;border-radius:9999px;border:2px solid #000;font:700 .9375rem/1 inherit;font-family:inherit;cursor:pointer;padding:0 1rem}
  .va-consent .va-yes{background:#000;color:#fff}
  .va-consent .va-no{background:#fff;color:#000}
  .va-consent button:focus-visible{outline:3px solid #3CC39B;outline-offset:2px}
  @media (min-width:640px){.va-consent{left:1.5rem;bottom:1.5rem}}`;

  const showBanner = () => {
    if (document.querySelector('.va-consent')) return;
    if (!document.getElementById('va-consent-css')) {
      const st = document.createElement('style');
      st.id = 'va-consent-css';
      st.textContent = css;
      document.head.appendChild(st);
    }
    const box = document.createElement('section');
    box.className = 'va-consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Cookie preferences');
    box.innerHTML = '<p><strong>Cookies?</strong> We use analytics cookies only if you accept. ' +
      '<a href="/privacy.html#cookies">Privacy policy</a></p>' +
      '<div class="va-row"><button type="button" class="va-no">Reject</button><button type="button" class="va-yes">Accept</button></div>';
    const close = (analytics) => { save(analytics); box.remove(); };
    box.querySelector('.va-yes').onclick = () => close(true);
    box.querySelector('.va-no').onclick = () => close(false);
    document.body.appendChild(box);
    return box;
  };

  const ready = (fn) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());

  ready(() => {
    if (!saved) showBanner();

    // "Cookie settings" links reopen the banner.
    document.querySelectorAll('[data-cookie-settings]').forEach((el) => el.addEventListener('click', (e) => {
      e.preventDefault();
      const box = showBanner();
      if (box) box.querySelector('button').focus();
    }));

    // Conversion events: every email link is a lead; the pricing buttons also say which plan.
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href.startsWith('tel:')) {
        const section = a.closest('section[id], header, footer');
        gtag('event', 'generate_lead', { method: 'phone', link_location: section ? (section.id || section.tagName.toLowerCase()) : 'page' });
      }
      if (href.startsWith('mailto:')) {
        const subject = decodeURIComponent((href.split('subject=')[1] || '').split('&')[0]);
        const section = a.closest('section[id], header, footer');
        gtag('event', 'generate_lead', {
          method: 'email',
          lead_source: subject || 'general',
          link_location: section ? (section.id || section.tagName.toLowerCase()) : 'page',
          link_text: a.textContent.trim().slice(0, 100),
        });
      }
    });
  });
})();
