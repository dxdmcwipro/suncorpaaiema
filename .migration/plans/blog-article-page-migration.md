# Blog Article Page Migration Plan

## Overview
Migrate the AA Insurance blog article page "Protecting yourself from online scams and fraud" from https://www.aainsurance.co.nz/blog/at-home/scam-protection to AEM Edge Delivery Services.

## Source Page Analysis

**URL:** https://www.aainsurance.co.nz/blog/at-home/scam-protection  
**Page Type:** Blog article (long-form content with sidebar)  
**Title:** Protecting yourself from online scams and fraud

### Page Structure
| Section | Content Type | Notes |
|---------|-------------|-------|
| Breadcrumb | Navigation trail | Home / Blog / At home / Article title |
| H1 Heading | Default content | "Protecting yourself from online scams and fraud" |
| Article Body | Default content | Date (20/01/2026), hero image, paragraphs, H4 subheadings, bullet lists, external links |
| CTA Callout | Possible block | "Any questions?" section with call-to-action |
| Disclaimer | Default content | Fine-print legal disclaimer |
| Sidebar | Block(s) | "Let's get things sorted" (product links + Get a quote CTA) |
| Sidebar | Block(s) | "Browse other topics" (category links with icons) |
| Sidebar | Block(s) | "Read More" (related article cards with images) |

### Content Details
- **Article content**: Rich text with H4 subheadings, bullet lists, inline links to external sites (Netsafe, FMA, NCSC, DIA, NZ Police) and internal pages
- **Hero image**: "Woman on laptop" — article feature image
- **Sidebar widgets**: Product links, topic navigation, and related article cards
- **Metadata needed**: Title, description, date, category (At Home), image

## Existing Project State
- **Homepage already migrated** with `hero-promo`, `cards-homepage`, `columns-badges` blocks
- **Import infrastructure exists** for homepage template (parsers, transformers, bundled script)
- **Design tokens already applied** in `styles/styles.css`
- **No blog template exists yet** — new page template needed

## Migration Approach

This is a **blog article template** — distinct from the homepage template. It requires:
1. A new page template definition in `page-templates.json`
2. New block parser(s) for sidebar components
3. Updated page transformers to handle blog article layout
4. Content HTML file generation via import script

### Blocks Needed

| Block | Purpose | Exists? | Action |
|-------|---------|---------|--------|
| Default content | Article body (H1, paragraphs, lists, images) | Built-in | No block needed |
| `cards` (or `cards-related`) | "Read More" related articles | Base `cards` exists | May need blog variant |
| `columns` | Sidebar "Let's get things sorted" product links | Base `columns` exists | Assess reuse |
| Metadata | Page metadata (title, date, category, image) | Built-in EDS | Configure in template |

### Section Plan
1. **Section 1** — Article hero + body content (default content: H1, image, date, paragraphs, lists, subheadings, CTA callout, disclaimer)
2. **Section 2** — Sidebar content as a separate section (product links, topic links, related articles) — OR these could be omitted/simplified for the blog content migration since they appear to be shared navigation/cross-sell elements

## Checklist

### Analysis & Setup
- [ ] Analyze page DOM structure for exact selectors
- [ ] Determine if sidebar should be migrated as blocks or omitted (cross-sell/nav content)
- [ ] Add "blog-article" template to `page-templates.json`

### Import Infrastructure
- [ ] Create page transformer for blog article cleanup (strip nav, header, footer, notifications)
- [ ] Create section transformer for blog article sections
- [ ] Create block parser for sidebar components (if migrating sidebar)
- [ ] Generate bundled import script (`import-blog-article.bundle.js`)

### Content Generation
- [ ] Run import to produce `content/blog/at-home/scam-protection.plain.html`
- [ ] Download and save article hero image to content folder
- [ ] Verify metadata block (title, description, image, date, category)

### Verification
- [ ] Start local dev server and preview the migrated page
- [ ] Verify article body renders correctly (headings, lists, links, image)
- [ ] Verify page metadata displays correctly
- [ ] Compare visual output with original page
- [ ] Run linting on any new/modified JS/CSS

## Key Decisions Needed
1. **Sidebar content** — Should the sidebar ("Let's get things sorted", "Browse other topics", "Read More") be migrated as blocks, or treated as shared navigation that would be handled differently in EDS (e.g., fragments)?
2. **Blog template reuse** — This template would apply to all blog articles on the site. The structure looks consistent across blog posts.

## Execution
> This plan requires **Execute mode** to implement. Switch to execute mode to proceed with the migration steps.
