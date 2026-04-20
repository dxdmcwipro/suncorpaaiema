export default function decorate(block) {
  const firstRow = block.querySelector(':scope > div:first-child');
  const img = firstRow?.querySelector('picture, img');
  if (!img) {
    block.classList.add('no-image');
  }

  // Decorate CTA links as buttons and wrap in a white card
  const contentRow = block.querySelector(':scope > div:nth-child(2)');
  if (!contentRow) return;

  // Separate heading from card content
  const heading = contentRow.querySelector('h1');
  const allDivs = [...contentRow.querySelectorAll(':scope > div')];

  // Create the card container
  const card = document.createElement('div');
  card.className = 'hero-promo-card';

  // Move everything except the heading div into the card
  allDivs.forEach((div) => {
    if (!div.contains(heading)) {
      card.appendChild(div);
    }
  });

  // Decorate links as buttons inside the card
  const links = card.querySelectorAll('a');
  let buttonIndex = 0;
  links.forEach((link) => {
    const text = link.textContent.trim().toLowerCase();
    if (text.includes('terms') || link.querySelector('sub')) return;

    link.classList.add('button');
    if (buttonIndex === 0) {
      link.classList.add('primary');
    } else {
      link.classList.add('secondary');
    }

    const parent = link.parentElement;
    if (parent && parent.tagName !== 'P') {
      const wrapper = document.createElement('p');
      wrapper.className = 'button-wrapper';
      parent.replaceChild(wrapper, link);
      wrapper.appendChild(link);
    } else if (parent) {
      parent.classList.add('button-wrapper');
    }

    buttonIndex += 1;
  });

  contentRow.appendChild(card);
}
