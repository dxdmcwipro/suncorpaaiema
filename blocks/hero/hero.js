/**
 * Standard Hero block — card-overlay style.
 * Authored structure: single row with picture, h1, and paragraph(s).
 * Decorated structure: image wrapper + white content card.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cell = row.firstElementChild;
  if (!cell) return;

  const picture = cell.querySelector('picture');
  const h1 = cell.querySelector('h1');

  if (!picture || !h1) return;

  // Build image wrapper
  const imgWrap = document.createElement('div');
  imgWrap.className = 'hero-image';
  imgWrap.append(picture);

  // Build content card — everything after the picture
  const card = document.createElement('div');
  card.className = 'hero-card';
  const cardInner = document.createElement('div');
  cardInner.className = 'hero-card-inner';

  // Move remaining children (h1, paragraphs) into the card
  while (cell.firstChild) {
    cardInner.append(cell.firstChild);
  }
  card.append(cardInner);

  // Replace the block content
  block.textContent = '';
  block.append(imgWrap, card);
}
