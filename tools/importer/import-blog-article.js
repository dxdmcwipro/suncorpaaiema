/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsBlogSidebarParser from './parsers/cards-blog-sidebar.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/blog-article-cleanup.js';
import sectionsTransformer from './transformers/aainsurance-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-blog-sidebar': cardsBlogSidebarParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'blog-article',
  description: 'AA Insurance blog article page with breadcrumb, article body (hero image, date, rich text with H4 subheadings, bullet lists, inline links), sidebar with product links, topic navigation, and related article cards',
  urls: [
    'https://www.aainsurance.co.nz/blog/at-home/scam-protection',
  ],
  blocks: [
    {
      name: 'cards-blog-sidebar',
      instances: [
        'div.related-posts.related-posts-blog',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Article Body',
      selector: 'div.post-body',
      style: null,
      blocks: [],
      defaultContent: [
        'h1',
        'div.post-date',
        'img.image-auto-size',
        'p.paragraph',
        'h4',
        'ul',
        'div.content-block',
      ],
    },
    {
      id: 'section-2',
      name: 'Sidebar - Related Articles',
      selector: 'div.related-posts.related-posts-blog',
      style: null,
      blocks: ['cards-blog-sidebar'],
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
