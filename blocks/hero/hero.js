/**
 * Standard Hero block — card-overlay style.
 * Authored structure: single row with picture/img, h1, and paragraph(s).
 * Decorated structure: image wrapper + white content card.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cell = row.firstElementChild;
  if (!cell) return;

  // Find the image — could be <picture> or bare <img>
  const picture = cell.querySelector('picture');
  const img = cell.querySelector('img');
  const imageEl = picture || (img ? img.closest('p') || img : null);
  const h1 = cell.querySelector('h1');

  if (!h1) return;

  // Build image wrapper (only if we have a valid image)
  if (imageEl) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'hero-image';
    imgWrap.append(imageEl);

    // Build content card — everything remaining
    const card = document.createElement('div');
    card.className = 'hero-card';
    const cardInner = document.createElement('div');
    cardInner.className = 'hero-card-inner';

    while (cell.firstChild) {
      cardInner.append(cell.firstChild);
    }
    card.append(cardInner);

    block.textContent = '';
    block.append(imgWrap, card);
  }
}
