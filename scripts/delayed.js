/*
 * AA Insurance — delayed functionality
 * Loaded 3 seconds after page load to avoid impacting LCP.
 *
 * The original site uses:
 * - Google Tag Manager (GTM)
 * - Zendesk help widget
 * - Partytown for off-main-thread scripts
 *
 * Add third-party integrations here when ready.
 */

// Example: Google Tag Manager (uncomment and add your GTM ID when ready)
// function loadGTM(id) {
//   const script = document.createElement('script');
//   script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
//   script.async = true;
//   document.head.appendChild(script);
//   window.dataLayer = window.dataLayer || [];
//   window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
// }
// loadGTM('GTM-XXXXXXX');
