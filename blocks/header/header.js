import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

const TOOL_ICONS = {
  phone: '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 4.8c.2-1 1-1.8 2-1.8h2.2c.8 0 1.5.6 1.7 1.4l.7 2.8c.2.7-.1 1.4-.7 1.8l-1.6 1.1a13 13 0 0 0 5.1 5.1l1.1-1.6c.4-.6 1.1-.9 1.8-.7l2.8.7c.8.2 1.4.9 1.4 1.7V18c0 1-.8 1.8-1.8 2a17 17 0 0 1-14.7-15.2z"/></svg>',
  search: '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>',
  account: '<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/></svg>',
};

const AA_LOGO_SRC = '/icons/aa-insurance-logo.svg';

const CHEVRON_SVG = '<svg class="nav-chevron" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function closeAllDropdowns(sections) {
  if (!sections) return;
  sections.querySelectorAll('.nav-drop').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const sections = nav?.querySelector('.nav-sections');
    if (sections) {
      const expanded = sections.querySelector('[aria-expanded="true"]');
      if (expanded && isDesktop.matches) {
        closeAllDropdowns(sections);
        expanded.focus();
      } else if (!isDesktop.matches) {
        // eslint-disable-next-line no-use-before-define
        toggleMenu(nav, sections);
        nav.querySelector('.nav-hamburger button')?.focus();
      }
    }
  }
}

function toggleMenu(nav, sections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button?.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/* ------------------------------------------------------------------ */
/*  Mega-menu grouping — maps nav items to sub-categories by URL      */
/* ------------------------------------------------------------------ */

const MEGA_MENU_GROUPS = [
  {
    title: 'Car & Vehicle',
    match: /^\/(car-insurance|caravan-insurance|motorcycle-insurance|motorhome-insurance|classic-vehicle-insurance|trailer-insurance)/,
  },
  {
    title: 'Home & Contents',
    match: /^\/(home-insurance|contents-insurance|home-and-contents)/,
  },
  {
    title: 'Small Business',
    match: /^\/small-business/,
  },
  {
    title: 'More Insurance',
    match: /^\/(health-insurance|pet-insurance|travel-insurance|life-insurance)/,
  },
];

function buildMegaMenu(dropLi) {
  const innerUl = dropLi.querySelector(':scope > ul');
  if (!innerUl) return;

  // Try to assign each link to a mega-menu group
  const items = [...innerUl.children];
  const groups = MEGA_MENU_GROUPS.map((g) => ({ ...g, links: [] }));

  items.forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    const href = new URL(link.href, window.location).pathname;
    const group = groups.find((g) => g.match.test(href));
    if (group) group.links.push(link);
  });

  // Only build mega-menu if multiple groups have links
  const populatedGroups = groups.filter((g) => g.links.length > 0);
  if (populatedGroups.length < 2) return;

  dropLi.classList.add('nav-mega');

  const panel = document.createElement('div');
  panel.className = 'nav-mega-panel';

  const sidebar = document.createElement('div');
  sidebar.className = 'nav-mega-sidebar';

  const content = document.createElement('div');
  content.className = 'nav-mega-content';

  populatedGroups.forEach((group, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-mega-cat';
    btn.textContent = group.title;
    btn.setAttribute('data-cat', idx);
    if (idx === 0) btn.classList.add('is-active');

    const pane = document.createElement('div');
    pane.className = 'nav-mega-pane';
    pane.setAttribute('data-cat', idx);
    if (idx === 0) pane.classList.add('is-active');

    group.links.forEach((a) => {
      const link = document.createElement('a');
      link.href = a.href;
      link.className = 'nav-mega-link';
      link.textContent = a.textContent;
      pane.append(link);
    });

    const activate = () => {
      panel.querySelectorAll('.is-active').forEach((el) => el.classList.remove('is-active'));
      btn.classList.add('is-active');
      pane.classList.add('is-active');
    };

    btn.addEventListener('mouseenter', () => {
      if (isDesktop.matches) activate();
    });
    btn.addEventListener('click', () => {
      if (!isDesktop.matches) {
        if (btn.classList.contains('is-active')) {
          btn.classList.remove('is-active');
          pane.classList.remove('is-active');
        } else {
          activate();
        }
      }
    });

    sidebar.append(btn);
    content.append(pane);
  });

  panel.append(sidebar);
  panel.append(content);

  // Replace the original <ul> with the mega panel
  innerUl.replaceWith(panel);
}

/* ------------------------------------------------------------------ */
/*  Decorate                                                          */
/* ------------------------------------------------------------------ */

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Assign section classes
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  /* --- Brand --- */
  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand?.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }
  const logoLink = navBrand?.querySelector('a');
  if (logoLink) {
    const label = logoLink.textContent.trim() || 'AA Insurance';
    logoLink.innerHTML = `<img class="nav-brand-logo" src="${AA_LOGO_SRC}" alt="${label}" width="184" height="64">`;
    logoLink.setAttribute('aria-label', label);
  }

  /* --- Sections --- */
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Find top-level nav items — handle both local (div > div > ul > li)
    // and remote (div.default-content-wrapper > ul > li) DOM structures
    const topUl = navSections.querySelector('ul');
    if (!topUl) return;
    [...topUl.children].forEach((navSection) => {
      if (!navSection.querySelector('ul')) {
        navSection.remove();
        return;
      }
      navSection.classList.add('nav-drop');
      navSection.setAttribute('aria-expanded', 'false');

      // Add chevron to the title
      const titleP = navSection.querySelector(':scope > p');
      if (titleP) {
        titleP.insertAdjacentHTML('beforeend', CHEVRON_SVG);
      }

      // Check for 3-level mega-menu and build it
      buildMegaMenu(navSection);

      // Toggle on click
      navSection.addEventListener('click', (e) => {
        const clickedLink = e.target.closest('a');
        if (clickedLink) return; // let links navigate

        // On mega-menu cat buttons, don't toggle the whole dropdown
        if (e.target.closest('.nav-mega-cat')) return;

        const wasExpanded = navSection.getAttribute('aria-expanded') === 'true';
        if (isDesktop.matches) closeAllDropdowns(navSections);
        navSection.setAttribute('aria-expanded', wasExpanded ? 'false' : 'true');
      });
    });

    // Close on click outside (desktop)
    document.addEventListener('click', (e) => {
      if (isDesktop.matches && !navSections.contains(e.target)) {
        closeAllDropdowns(navSections);
      }
    });
  }

  /* --- Tools --- */
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    navTools.querySelectorAll('a').forEach((a) => {
      const key = a.textContent.trim().toLowerCase();
      const svg = TOOL_ICONS[key];
      if (svg) {
        a.setAttribute('aria-label', a.textContent.trim());
        a.innerHTML = svg;
        a.classList.add('nav-tool-icon');
      }
    });
  }

  /* --- Hamburger --- */
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  /* --- Wrap & mount --- */
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Scroll shadow
  const onScroll = () => navWrapper.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
