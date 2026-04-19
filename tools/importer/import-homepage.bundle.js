var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-promo.js
  function parse(element, { document }) {
    const cells = [];
    const bgImg = element.querySelector(".hero-abl-backdrop-image img, .hero-abl-backdrop img");
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentCell = [];
    const heading = element.querySelector(".hero-abl-header h1, .hero-abl-header h2, h1, h2");
    if (heading) contentCell.push(heading);
    const ctaLinks = element.querySelectorAll(".hero-abl-card-link > a.button");
    ctaLinks.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href;
      const labelEl = link.querySelector(".button--label__text");
      a.textContent = labelEl ? labelEl.textContent.trim() : link.textContent.trim();
      contentCell.push(a);
    });
    const promoContent = element.querySelectorAll(".hero-abl-card-content p.paragraph");
    promoContent.forEach((p) => {
      if (p.textContent.trim()) contentCell.push(p);
    });
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-homepage.js
  function parse2(element, { document }) {
    const cells = [];
    const gridCards = element.querySelectorAll(".grid-card");
    const productIcons = element.querySelectorAll(".product-icon");
    if (gridCards.length > 0) {
      gridCards.forEach((card) => {
        const img = card.querySelector(".grid-card-hero img");
        const title = card.querySelector(".grid-card-title");
        const desc = card.querySelector(".grid-card-description");
        const ctaLink = card.querySelector(".grid-card-footer a");
        const imageCell = [];
        if (img) imageCell.push(img);
        const contentCell = [];
        if (title) {
          const h = document.createElement("h3");
          h.textContent = title.textContent.trim();
          contentCell.push(h);
        }
        if (desc) {
          const paragraphs = desc.querySelectorAll("p.paragraph");
          paragraphs.forEach((p) => {
            if (p.textContent.trim()) contentCell.push(p);
          });
        }
        if (ctaLink) {
          const a = document.createElement("a");
          a.href = ctaLink.href;
          const labelEl = ctaLink.querySelector(".button--label__text");
          a.textContent = labelEl ? labelEl.textContent.trim() : ctaLink.textContent.trim();
          contentCell.push(a);
        }
        if (imageCell.length > 0 || contentCell.length > 0) {
          cells.push([imageCell, contentCell]);
        }
      });
    } else if (productIcons.length > 0) {
      productIcons.forEach((icon) => {
        const img = icon.querySelector(".product-icon-wrapper__fa img, .icon-wrapper img");
        const headingLink = icon.querySelector(".product-icon__heading-link, .product-icon__icon-link");
        const label = icon.querySelector(".product-icon__heading-link");
        const subheading = icon.querySelector(".product-icon__subheading");
        const imageCell = [];
        if (img) imageCell.push(img);
        const contentCell = [];
        if (label) {
          const h = document.createElement("h3");
          h.textContent = label.textContent.trim();
          contentCell.push(h);
        } else if (headingLink) {
          const h = document.createElement("h3");
          h.textContent = headingLink.textContent.trim();
          contentCell.push(h);
        }
        if (subheading) {
          const p = document.createElement("p");
          p.textContent = subheading.textContent.trim();
          contentCell.push(p);
        }
        if (headingLink && headingLink.href) {
          const a = document.createElement("a");
          a.href = headingLink.href;
          a.textContent = "Learn more";
          contentCell.push(a);
        }
        if (contentCell.length > 0) {
          cells.push([imageCell, contentCell]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-badges.js
  function parse3(element, { document }) {
    const cells = [];
    const row = [];
    const columns = element.querySelectorAll(':scope > .container > .row > [class*="col-12"], :scope > .container > .row.row__content > [class*="col-12"]');
    if (columns.length > 0) {
      columns.forEach((col) => {
        const colContent = [];
        const img = col.querySelector(".image-wrapper img, .image-wrapped");
        if (img) {
          colContent.push(img);
        }
        const heading = col.querySelector(".content-block__title, h6");
        if (heading) {
          const h = document.createElement("h3");
          h.textContent = heading.textContent.trim();
          colContent.push(h);
        }
        const contentDiv = col.querySelector(".content-block__content");
        if (contentDiv) {
          const paragraphs = contentDiv.querySelectorAll("p.paragraph");
          paragraphs.forEach((p) => {
            if (p.textContent.trim()) {
              const link = p.querySelector("a");
              if (link) {
                const a = document.createElement("a");
                a.href = link.href;
                a.textContent = link.textContent.trim();
                colContent.push(a);
              } else {
                colContent.push(p);
              }
            }
          });
        }
        if (colContent.length > 0) {
          row.push(colContent);
        }
      });
    }
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-badges", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/aainsurance-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".modal-popup",
        ".bokeh-container"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".header-component",
        "header.header",
        "footer.aa-footer",
        ".spacer",
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-testid");
      });
    }
  }

  // tools/importer/transformers/aainsurance-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-promo": parse,
    "cards-homepage": parse2,
    "columns-badges": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AA Insurance homepage with hero promo banner, product icon grid, feature spotlight, news cards, value propositions, and trust badges",
    urls: [
      "https://www.aainsurance.co.nz/"
    ],
    blocks: [
      {
        name: "hero-promo",
        instances: [
          "div.hero-abl.hero-abl--style-default"
        ]
      },
      {
        name: "cards-homepage",
        instances: [
          "div.content-blocks > div.columns.mobile-lower-50",
          "div.card-grid:has(.card-grid-columns-1)",
          "div.card-grid:has(.card-grid-columns-3)"
        ]
      },
      {
        name: "columns-badges",
        instances: [
          "div.columns.why-choose-aai-footer",
          "div.columns.text__align-center"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "div.hero-abl.hero-abl--style-default",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Product Icon Grid",
        selector: "div.content-blocks > div.columns.mobile-lower-50",
        style: null,
        blocks: ["cards-homepage"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Feature Spotlight",
        selector: "div.card-grid:has(.card-grid-columns-1)",
        style: null,
        blocks: ["cards-homepage"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "News Announcement Cards",
        selector: "div.card-grid:has(.card-grid-columns-3)",
        style: null,
        blocks: ["cards-homepage"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Why Choose AA Insurance",
        selector: "div.columns.why-choose-aai-footer",
        style: null,
        blocks: ["columns-badges"],
        defaultContent: ["h2.columns__heading"]
      },
      {
        id: "section-6",
        name: "Trust Badges",
        selector: "div.columns.text__align-center",
        style: null,
        blocks: ["columns-badges"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
