/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPromoParser from './parsers/hero-promo.js';
import cardsHomepageParser from './parsers/cards-homepage.js';
import columnsBadgesParser from './parsers/columns-badges.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/aainsurance-cleanup.js';
import sectionsTransformer from './transformers/aainsurance-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-promo': heroPromoParser,
  'cards-homepage': cardsHomepageParser,
  'columns-badges': columnsBadgesParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AA Insurance homepage with hero promo banner, product icon grid, feature spotlight, news cards, value propositions, and trust badges',
  urls: [
    'https://www.aainsurance.co.nz/',
  ],
  blocks: [
    {
      name: 'hero-promo',
      instances: [
        'div.hero-abl.hero-abl--style-default',
      ],
    },
    {
      name: 'cards-homepage',
      instances: [
        'div.content-blocks > div.columns.mobile-lower-50',
        'div.card-grid:has(.card-grid-columns-1)',
        'div.card-grid:has(.card-grid-columns-3)',
      ],
    },
    {
      name: 'columns-badges',
      instances: [
        'div.columns.why-choose-aai-footer',
        'div.columns.text__align-center',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'div.hero-abl.hero-abl--style-default',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Product Icon Grid',
      selector: 'div.content-blocks > div.columns.mobile-lower-50',
      style: null,
      blocks: ['cards-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Feature Spotlight',
      selector: 'div.card-grid:has(.card-grid-columns-1)',
      style: null,
      blocks: ['cards-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'News Announcement Cards',
      selector: 'div.card-grid:has(.card-grid-columns-3)',
      style: null,
      blocks: ['cards-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Why Choose AA Insurance',
      selector: 'div.columns.why-choose-aai-footer',
      style: null,
      blocks: ['columns-badges'],
      defaultContent: ['h2.columns__heading'],
    },
    {
      id: 'section-6',
      name: 'Trust Badges',
      selector: 'div.columns.text__align-center',
      style: null,
      blocks: ['columns-badges'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
