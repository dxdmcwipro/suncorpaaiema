/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-homepage. Base: cards.
 * Source: https://www.aainsurance.co.nz/
 * Handles 3 instances:
 *   1. Product icon grid (div.columns.mobile-lower-50) — icons with labels
 *   2. Feature spotlight (div.card-grid with 1-col) — single large card
 *   3. News cards (div.card-grid with 3-col) — three announcement cards
 * Structure per block library: each row = [image | heading + text + CTA]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which instance this is
  const gridCards = element.querySelectorAll('.grid-card');
  const productIcons = element.querySelectorAll('.product-icon');

  if (gridCards.length > 0) {
    // Instance 2 or 3: card-grid with grid-card items
    gridCards.forEach((card) => {
      const img = card.querySelector('.grid-card-hero img');
      const title = card.querySelector('.grid-card-title');
      const desc = card.querySelector('.grid-card-description');
      const ctaLink = card.querySelector('.grid-card-footer a');

      const imageCell = [];
      if (img) imageCell.push(img);

      const contentCell = [];
      if (title) {
        const h = document.createElement('h3');
        h.textContent = title.textContent.trim();
        contentCell.push(h);
      }
      if (desc) {
        const paragraphs = desc.querySelectorAll('p.paragraph');
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) contentCell.push(p);
        });
      }
      if (ctaLink) {
        const a = document.createElement('a');
        a.href = ctaLink.href;
        const labelEl = ctaLink.querySelector('.button--label__text');
        a.textContent = labelEl ? labelEl.textContent.trim() : ctaLink.textContent.trim();
        contentCell.push(a);
      }

      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
  } else if (productIcons.length > 0) {
    // Instance 1: Product icon grid
    productIcons.forEach((icon) => {
      const img = icon.querySelector('.product-icon-wrapper__fa img, .icon-wrapper img');
      const headingLink = icon.querySelector('.product-icon__heading-link, .product-icon__icon-link');
      const label = icon.querySelector('.product-icon__heading-link');
      const subheading = icon.querySelector('.product-icon__subheading');

      const imageCell = [];
      if (img) imageCell.push(img);

      const contentCell = [];
      if (label) {
        const h = document.createElement('h3');
        h.textContent = label.textContent.trim();
        contentCell.push(h);
      } else if (headingLink) {
        const h = document.createElement('h3');
        h.textContent = headingLink.textContent.trim();
        contentCell.push(h);
      }
      if (subheading) {
        const p = document.createElement('p');
        p.textContent = subheading.textContent.trim();
        contentCell.push(p);
      }
      if (headingLink && headingLink.href) {
        const a = document.createElement('a');
        a.href = headingLink.href;
        a.textContent = 'Learn more';
        contentCell.push(a);
      }

      if (contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-homepage', cells });
  element.replaceWith(block);
}
