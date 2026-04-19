import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = {
  facebook: '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2v2.2H7.5V13h2.7v8h3.3z"/></svg>',
  instagram: '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.3 4.2.6c-.8.3-1.4.7-2.1 1.3C1.5 2.5 1.1 3.2.8 4c-.3.7-.5 1.6-.6 2.9C0 8.1 0 8.5 0 12s0 3.9.1 5.1c.1 1.3.3 2.2.6 2.9.3.8.7 1.4 1.3 2.1.7.7 1.3 1.1 2.1 1.4.7.3 1.6.5 2.9.6 1.2.1 1.6.1 5.1.1s3.9 0 5.1-.1c1.3-.1 2.2-.3 2.9-.6.8-.3 1.4-.7 2.1-1.4.7-.7 1.1-1.3 1.4-2.1.3-.7.5-1.6.6-2.9.1-1.2.1-1.6.1-5.1s0-3.9-.1-5.1c-.1-1.3-.3-2.2-.6-2.9-.3-.8-.7-1.4-1.4-2.1C21.5 1.5 20.8 1.1 20 .8c-.7-.3-1.6-.5-2.9-.6C15.9 0 15.5 0 12 0zm0 5.8c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2S15.4 5.8 12 5.8zm0 10.2c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm6.4-11.8c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4z"/></svg>',
  tiktok: '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/></svg>',
  linkedin: '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>',
  youtube: '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>',
  email: '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5z"/></svg>',
  'shielded site': '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.4 15.6L6 12l1.4-1.4 3.2 3.2 6.2-6.2L18.2 9l-7.6 7.6z"/></svg>',
};

/**
 * Strip pipe separators and empty whitespace-only text nodes.
 * Authors use " | " as visual separators; we render real spacing in CSS.
 */
function stripPipeSeparators(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const toRemove = [];
  let node = walker.nextNode();
  while (node) {
    if (/^[\s|]*$/.test(node.nodeValue)) toRemove.push(node);
    node = walker.nextNode();
  }
  toRemove.forEach((n) => n.remove());
}

function decorateSocial(section) {
  if (!section) return;
  section.classList.add('footer-social');
  stripPipeSeparators(section);

  const links = section.querySelectorAll('a');
  const wrap = document.createElement('ul');
  wrap.className = 'social-icons';

  links.forEach((a) => {
    const label = a.textContent.trim();
    const key = label.toLowerCase();
    const svg = SOCIAL_ICONS[key];
    if (svg) {
      a.innerHTML = svg;
      a.setAttribute('aria-label', label);
      a.setAttribute('title', label);
    }
    a.classList.add('social-icon');
    if (key === 'shielded site') a.classList.add('social-icon-shielded');

    const li = document.createElement('li');
    li.append(a);
    wrap.append(li);
  });

  // Replace the original paragraph with the clean list
  const p = section.querySelector('p');
  if (p) p.replaceWith(wrap);
}

function decorateLegal(section) {
  if (!section) return;
  section.classList.add('footer-legal');
  stripPipeSeparators(section);

  // First <p> = legal links — convert to <ul> for semantics and spacing
  const paragraphs = section.querySelectorAll('p');
  if (paragraphs.length >= 1) {
    const legalLinks = paragraphs[0].querySelectorAll('a');
    if (legalLinks.length) {
      const ul = document.createElement('ul');
      ul.className = 'legal-links';
      legalLinks.forEach((a) => {
        const li = document.createElement('li');
        li.append(a);
        ul.append(li);
      });
      paragraphs[0].replaceWith(ul);
    }
  }

  // Any remaining <p> (copyright) gets a class
  section.querySelectorAll('p').forEach((p) => p.classList.add('copyright'));
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = footer.querySelectorAll(':scope > .section');
  if (sections[0]) sections[0].classList.add('footer-links');
  decorateSocial(sections[1]);
  decorateLegal(sections[2]);

  block.append(footer);
}
