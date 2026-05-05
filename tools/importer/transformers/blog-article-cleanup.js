/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Blog article cleanup.
 * Removes non-content elements, unwraps article body from layout wrappers,
 * and normalizes blog-specific content.
 * Selectors from captured DOM of https://www.aainsurance.co.nz/blog/at-home/scam-protection
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove modal popups and overlays
    WebImporter.DOMUtils.remove(element, [
      '.modal-popup',
      '.bokeh-container',
    ]);

    // Remove notification banner
    WebImporter.DOMUtils.remove(element, [
      '.notifications',
    ]);
  }

  if (hookName === H.after) {
    const document = element.ownerDocument;

    // Remove non-authorable chrome
    WebImporter.DOMUtils.remove(element, [
      '.header-component',
      'header.header',
      'footer.aa-footer',
      '.spacer',
      'noscript',
      'link',
      'iframe',
      '.breadcrumb-wrapper',
      '.post-sidebar-desktop',
      '.post-sidebar-mobile',
      'style',
    ]);

    // Remove inline style elements within article body
    element.querySelectorAll('style').forEach((el) => el.remove());

    // Unwrap article body from layout containers
    const postBody = element.querySelector('.post-body');
    if (postBody) {
      // Extract date and convert to a paragraph
      const postDate = postBody.querySelector('.post-date');
      if (postDate) {
        const datePara = document.createElement('p');
        datePara.innerHTML = `<em>${postDate.textContent.trim()}</em>`;
        postDate.replaceWith(datePara);
      }

      // Find the content div (second child containing article text)
      const contentDiv = postBody.querySelector(':scope > div:nth-child(2)');
      if (contentDiv) {
        // Move all content children up to post-body level
        while (contentDiv.firstChild) {
          postBody.appendChild(contentDiv.firstChild);
        }
        contentDiv.remove();
      }
    }

    // Clean up content-block divs (CTA callout and disclaimer)
    element.querySelectorAll('.content-block').forEach((block) => {
      const title = block.querySelector('.content-block__title');
      const content = block.querySelector('.content-block__content');

      if (title && content) {
        // Replace with heading + content
        const h4 = document.createElement('h4');
        h4.textContent = title.textContent.trim();
        block.before(h4);

        const innerDiv = content.querySelector(':scope > div');
        if (innerDiv) {
          while (innerDiv.firstChild) {
            block.before(innerDiv.firstChild);
          }
        }
        block.remove();
      } else if (content) {
        // Disclaimer or no-title block — unwrap content
        const innerDiv = content.querySelector(':scope > div');
        if (innerDiv) {
          while (innerDiv.firstChild) {
            block.before(innerDiv.firstChild);
          }
        }
        block.remove();
      }
    });

    // Remove the get-quote sidebar (cross-sell widget, not article content)
    WebImporter.DOMUtils.remove(element, ['.get-quote']);

    // Unwrap layout wrappers to flatten article content
    const twoColumns = element.querySelector('.two-columns');
    if (twoColumns) {
      const container = twoColumns.querySelector('.container');
      if (container) {
        // Get the H1 row
        const h1Row = container.querySelector('.row .col-12 h1');
        if (h1Row) {
          twoColumns.before(h1Row);
        }

        // Get post-body and sidebar
        const postBodyEl = container.querySelector('.post-body');
        if (postBodyEl) {
          while (postBodyEl.firstChild) {
            twoColumns.before(postBodyEl.firstChild);
          }
        }

        // Move any remaining sidebar content (parsed block tables) before removal
        const sidebarCol = container.querySelector('.col-12.col-lg-4');
        if (sidebarCol) {
          // Move parsed block tables (created by parsers before afterTransform)
          sidebarCol.querySelectorAll('table').forEach((table) => {
            twoColumns.before(table);
          });
        }

        twoColumns.remove();
      }
    }

    // Rewrite image URLs from AA Insurance CDN proxy
    element.querySelectorAll('img[src*="/x/ctf/"]').forEach((img) => {
      img.src = img.src.replace(/https?:\/\/www\.aainsurance\.co\.nz\/x\/ctf\//, 'https://images.ctfassets.net/');
    });

    // Clean image classes and attributes
    element.querySelectorAll('img').forEach((img) => {
      img.removeAttribute('class');
      img.removeAttribute('fetchpriority');
      img.removeAttribute('decoding');
    });

    // Remove empty paragraphs
    element.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.querySelector('img')) {
        p.remove();
      }
    });

    // Remove paragraph class attributes (not needed in EDS)
    element.querySelectorAll('p.paragraph').forEach((p) => {
      p.removeAttribute('class');
    });

    // Remove data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-testid');
    });
  }
}
