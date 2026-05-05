/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-blog-sidebar. Base: cards.
 * Source: https://www.aainsurance.co.nz/blog/at-home/scam-protection
 * Handles the "Read More" related posts sidebar in blog articles.
 * Structure per block library: each row = [image | heading + description + link]
 */
export default function parse(element, { document }) {
  const cells = [];

  const articles = element.querySelectorAll('li');

  articles.forEach((li) => {
    const link = li.querySelector('a');
    const img = li.querySelector('img');
    const title = li.querySelector('h5');
    const description = li.querySelectorAll('p');
    const href = link ? link.getAttribute('href') : '';

    const imageCell = [];
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.push(newImg);
    }

    const contentCell = [];
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      contentCell.push(h);
    }

    // Get the description paragraph (skip category and "Find out more" labels)
    description.forEach((p) => {
      const text = p.textContent.trim();
      if (text && text !== 'Find out more' && text.length > 20) {
        const para = document.createElement('p');
        para.textContent = text;
        contentCell.push(para);
      }
    });

    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = 'Read more';
      contentCell.push(a);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
