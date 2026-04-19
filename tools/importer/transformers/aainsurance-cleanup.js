/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AA Insurance cleanup.
 * Selectors from captured DOM of https://www.aainsurance.co.nz/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove modal popups and overlays that may interfere with block parsing
    // Found in captured DOM: div.modal-popup, div.modal-popup__overlay
    WebImporter.DOMUtils.remove(element, [
      '.modal-popup',
      '.bokeh-container',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable content (header, footer, nav, spacers)
    // Found in captured DOM: header.header, footer.aa-footer, div.header-component, div.spacer
    WebImporter.DOMUtils.remove(element, [
      '.header-component',
      'header.header',
      'footer.aa-footer',
      '.spacer',
      'noscript',
      'link',
      'iframe',
    ]);

    // Rewrite Contentful CDN proxy URLs to direct Contentful URLs
    // Original: https://www.aainsurance.co.nz/x/ctf/70piar1ns1oi/...
    // Fixed:    https://images.ctfassets.net/70piar1ns1oi/...
    element.querySelectorAll('img[src*="/x/ctf/"]').forEach((img) => {
      img.src = img.src.replace(/https?:\/\/www\.aainsurance\.co\.nz\/x\/ctf\//, 'https://images.ctfassets.net/');
    });

    // Remove data attributes and event handlers
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-testid');
    });
  }
}
