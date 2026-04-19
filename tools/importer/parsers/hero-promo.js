/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo. Base: hero.
 * Source: https://www.aainsurance.co.nz/
 * Source DOM: div.hero-abl.hero-abl--style-default
 * Structure: Row 1 = background image, Row 2 = heading + CTAs + promo text
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Background image (from picture.hero-abl-backdrop-image img)
  const bgImg = element.querySelector('.hero-abl-backdrop-image img, .hero-abl-backdrop img');
  if (bgImg) {
    cells.push([bgImg]);
  }

  // Row 2: Content — heading + CTA links + promo text
  const contentCell = [];

  // Heading (h1 inside .hero-abl-header)
  const heading = element.querySelector('.hero-abl-header h1, .hero-abl-header h2, h1, h2');
  if (heading) contentCell.push(heading);

  // CTA buttons (direct links, not modal dropdown links)
  const ctaLinks = element.querySelectorAll('.hero-abl-card-link > a.button');
  ctaLinks.forEach((link) => {
    // Create a clean link from the button
    const a = document.createElement('a');
    a.href = link.href;
    const labelEl = link.querySelector('.button--label__text');
    a.textContent = labelEl ? labelEl.textContent.trim() : link.textContent.trim();
    contentCell.push(a);
  });

  // Promo text (from .hero-abl-card-content paragraphs)
  const promoContent = element.querySelectorAll('.hero-abl-card-content p.paragraph');
  promoContent.forEach((p) => {
    if (p.textContent.trim()) contentCell.push(p);
  });

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
