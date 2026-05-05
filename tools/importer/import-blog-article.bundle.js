var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import-blog-article.js
  var import_blog_article_exports = {};
  __export(import_blog_article_exports, {
    default: () => import_blog_article_default
  });

  // tools/importer/parsers/cards-blog-sidebar.js
  function parse(element, { document }) {
    const cells = [];
    const articles = element.querySelectorAll("li");
    articles.forEach((li) => {
      const link = li.querySelector("a");
      const img = li.querySelector("img");
      const title = li.querySelector("h5");
      const description = li.querySelectorAll("p");
      const href = link ? link.getAttribute("href") : "";
      const imageCell = [];
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        imageCell.push(newImg);
      }
      const contentCell = [];
      if (title) {
        const h = document.createElement("h3");
        h.textContent = title.textContent.trim();
        contentCell.push(h);
      }
      description.forEach((p) => {
        const text = p.textContent.trim();
        if (text && text !== "Find out more" && text.length > 20) {
          const para = document.createElement("p");
          para.textContent = text;
          contentCell.push(para);
        }
      });
      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = "Read more";
        contentCell.push(a);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/blog-article-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".modal-popup",
        ".bokeh-container"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".notifications"
      ]);
    }
    if (hookName === H.after) {
      const document = element.ownerDocument;
      WebImporter.DOMUtils.remove(element, [
        ".header-component",
        "header.header",
        "footer.aa-footer",
        ".spacer",
        "noscript",
        "link",
        "iframe",
        ".breadcrumb-wrapper",
        ".post-sidebar-desktop",
        ".post-sidebar-mobile",
        "style"
      ]);
      element.querySelectorAll("style").forEach((el) => el.remove());
      const postBody = element.querySelector(".post-body");
      if (postBody) {
        const postDate = postBody.querySelector(".post-date");
        if (postDate) {
          const datePara = document.createElement("p");
          datePara.innerHTML = `<em>${postDate.textContent.trim()}</em>`;
          postDate.replaceWith(datePara);
        }
        const contentDiv = postBody.querySelector(":scope > div:nth-child(2)");
        if (contentDiv) {
          while (contentDiv.firstChild) {
            postBody.appendChild(contentDiv.firstChild);
          }
          contentDiv.remove();
        }
      }
      element.querySelectorAll(".content-block").forEach((block) => {
        const title = block.querySelector(".content-block__title");
        const content = block.querySelector(".content-block__content");
        if (title && content) {
          const h4 = document.createElement("h4");
          h4.textContent = title.textContent.trim();
          block.before(h4);
          const innerDiv = content.querySelector(":scope > div");
          if (innerDiv) {
            while (innerDiv.firstChild) {
              block.before(innerDiv.firstChild);
            }
          }
          block.remove();
        } else if (content) {
          const innerDiv = content.querySelector(":scope > div");
          if (innerDiv) {
            while (innerDiv.firstChild) {
              block.before(innerDiv.firstChild);
            }
          }
          block.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, [".get-quote"]);
      const twoColumns = element.querySelector(".two-columns");
      if (twoColumns) {
        const container = twoColumns.querySelector(".container");
        if (container) {
          const h1Row = container.querySelector(".row .col-12 h1");
          if (h1Row) {
            twoColumns.before(h1Row);
          }
          const postBodyEl = container.querySelector(".post-body");
          if (postBodyEl) {
            while (postBodyEl.firstChild) {
              twoColumns.before(postBodyEl.firstChild);
            }
          }
          const sidebarCol = container.querySelector(".col-12.col-lg-4");
          if (sidebarCol) {
            sidebarCol.querySelectorAll("table").forEach((table) => {
              twoColumns.before(table);
            });
          }
          twoColumns.remove();
        }
      }
      element.querySelectorAll('img[src*="/x/ctf/"]').forEach((img) => {
        img.src = img.src.replace(/https?:\/\/www\.aainsurance\.co\.nz\/x\/ctf\//, "https://images.ctfassets.net/");
      });
      element.querySelectorAll('img[src*="aainsurance.co.nz/i/"]').forEach((img) => {
        try {
          const url = new URL(img.src);
          url.searchParams.delete("xid");
          img.src = url.toString();
        } catch (e) {
          img.src = img.src.replace(/[?&]xid=[^&]*/, "").replace(/\?&/, "?").replace(/\?$/, "");
        }
      });
      element.querySelectorAll("img").forEach((img) => {
        img.removeAttribute("class");
        img.removeAttribute("fetchpriority");
        img.removeAttribute("decoding");
      });
      element.querySelectorAll("p").forEach((p) => {
        if (!p.textContent.trim() && !p.querySelector("img")) {
          p.remove();
        }
      });
      element.querySelectorAll("p.paragraph").forEach((p) => {
        p.removeAttribute("class");
      });
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

  // tools/importer/import-blog-article.js
  var parsers = {
    "cards-blog-sidebar": parse
  };
  var PAGE_TEMPLATE = {
    name: "blog-article",
    description: "AA Insurance blog article page with breadcrumb, article body (hero image, date, rich text with H4 subheadings, bullet lists, inline links), sidebar with product links, topic navigation, and related article cards",
    urls: [
      "https://www.aainsurance.co.nz/blog/at-home/scam-protection"
    ],
    blocks: [
      {
        name: "cards-blog-sidebar",
        instances: [
          "div.related-posts.related-posts-blog"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Article Body",
        selector: "div.post-body",
        style: null,
        blocks: [],
        defaultContent: [
          "h1",
          "div.post-date",
          "img.image-auto-size",
          "p.paragraph",
          "h4",
          "ul",
          "div.content-block"
        ]
      },
      {
        id: "section-2",
        name: "Sidebar - Related Articles",
        selector: "div.related-posts.related-posts-blog",
        style: null,
        blocks: ["cards-blog-sidebar"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
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
  var import_blog_article_default = {
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
  return __toCommonJS(import_blog_article_exports);
})();
