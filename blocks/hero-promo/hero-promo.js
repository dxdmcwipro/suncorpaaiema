export default function decorate(block) {
  const firstRow = block.querySelector(':scope > div:first-child');
  const img = firstRow?.querySelector('picture, img');
  if (!img) {
    block.classList.add('no-image');
  }

  // Decorate CTA links as buttons in the content row
  const contentRow = block.querySelector(':scope > div:nth-child(2)');
  if (contentRow) {
    const links = contentRow.querySelectorAll('a');
    let buttonIndex = 0;
    links.forEach((link) => {
      const text = link.textContent.trim().toLowerCase();
      // Skip non-CTA links (terms, etc.)
      if (text.includes('terms') || link.querySelector('sub')) return;

      link.classList.add('button');
      if (buttonIndex === 0) {
        link.classList.add('primary');
      } else {
        link.classList.add('secondary');
      }

      // Wrap in button-wrapper paragraph if not already
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
  }
}
