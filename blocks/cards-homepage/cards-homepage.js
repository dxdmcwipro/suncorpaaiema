import { createOptimizedPicture } from '../../scripts/aem.js';

function isIconImage(img) {
  return img && img.src && img.src.includes('/icons/');
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  let hasRealImages = false;
  let hasIcons = false;

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const pic = div.querySelector('picture');
      const img = div.querySelector('img');
      const icon = div.querySelector('.icon');

      if (icon || isIconImage(img)) {
        div.className = 'cards-homepage-card-icon';
        hasIcons = true;
      } else if ((pic && div.children.length === 1) || img) {
        div.className = 'cards-homepage-card-image';
        hasRealImages = true;
      } else {
        div.className = 'cards-homepage-card-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    if (!isIconImage(img)) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.closest('picture').replaceWith(optimizedPic);
    }
  });

  // Icon grid: has icon images/spans, no real content images
  if (hasIcons && !hasRealImages) {
    block.classList.add('icon-grid');
  }

  // Spotlight: single card with real image
  const items = ul.querySelectorAll('li');
  if (items.length === 1 && hasRealImages) {
    block.classList.add('spotlight');
  }

  block.textContent = '';
  block.append(ul);
}
