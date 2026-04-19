/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-badges. Base: columns.
 * Source: https://www.aainsurance.co.nz/
 * Handles 2 instances:
 *   1. "Why Choose" value props (div.columns.why-choose-aai-footer) — 3 cols with icon + heading + text + link
 *   2. Trust badges (div.columns.text__align-center) — 3 cols with badge image + heading + link
 * Structure per block library: 1 row with N columns, each column = image + heading + text
 */
export default function parse(element, { document }) {
  const cells = [];
  const row = [];

  // Find columns — either col-12 col-md-4 divs or direct children
  const columns = element.querySelectorAll(':scope > .container > .row > [class*="col-12"], :scope > .container > .row.row__content > [class*="col-12"]');

  if (columns.length > 0) {
    columns.forEach((col) => {
      const colContent = [];

      // Image (badge icon or circle icon)
      const img = col.querySelector('.image-wrapper img, .image-wrapped');
      if (img) {
        colContent.push(img);
      }

      // Heading
      const heading = col.querySelector('.content-block__title, h6');
      if (heading) {
        const h = document.createElement('h3');
        h.textContent = heading.textContent.trim();
        colContent.push(h);
      }

      // Description text
      const contentDiv = col.querySelector('.content-block__content');
      if (contentDiv) {
        const paragraphs = contentDiv.querySelectorAll('p.paragraph');
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) {
            // Check if it contains a link
            const link = p.querySelector('a');
            if (link) {
              const a = document.createElement('a');
              a.href = link.href;
              a.textContent = link.textContent.trim();
              colContent.push(a);
            } else {
              colContent.push(p);
            }
          }
        });
      }

      if (colContent.length > 0) {
        row.push(colContent);
      }
    });
  }

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-badges', cells });
  element.replaceWith(block);
}
