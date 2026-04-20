# Product Icon Grid Not Rendering on AEM Page Environment

## Problem

The product icon grid (12 insurance products with blue SVG icons in circular badges) renders correctly on `localhost:3000` but does **not** render on the AEM Page environment at `https://main--suncorpaaiema--dxdmcwipro.aem.page/`.

## Root Cause AnalysisThe grep is hitting the line-length limit on the single-line HTML. Let me check differently:The page IS rendering on `.aem.page` — the product icon grid section exists with the correct 12 products. The issue might be that the **icons don't display visually** (the SVG files may not be deployed or committed to git). Let me check if the code has been pushed:The icon files ARE deployed and loading. So the content and icons are both available on `.aem.page`. The issue is likely that the **block JS or CSS** isn't deploying correctly — specifically the `cards-homepage` block's `.icon-grid` variant detection or the icon styling.Everything is deployed correctly — icons, CSS, JS all load on `.aem.page`. The content includes the product grid. Let me now check what the actual rendered page looks like to understand the specific rendering issue:Now I can see the issue clearly. The page at the root URL (`/`) renders, but the **icon `<span>` elements are completely missing from the DOM**. The product grid shows headings (Car, Home, Contents, etc.) but NO icon spans. Looking at the list items:

```
listitem → heading "Car" → link "Car"
```

vs what should be:

```
listitem → paragraph (with icon span) → heading "Car" → link "Car"
```

The icons are gone because EDS's content delivery pipeline strips `<span class="icon icon-car">` when it's inside a `<p>` tag — EDS expects icons to use the `:icon-name:` syntax in authored content, which gets converted to `<span class="icon icon-name">` during decoration. But in our case, we put the raw `<span>` HTML directly in the `.plain.html` file. **The AEM page delivery pipeline sanitizes this and removes empty spans.**

# Product Icon Grid — Icons Not Rendering on AEM Page

## Problem

The 12 product icon tiles (Car, Home, Contents, etc.) show as **text-only** on `https://main--suncorpaaiema--dxdmcwipro.aem.page/` — the circular icon badges with blue SVG icons are missing. They work locally on `localhost:3000`.

## Root Cause

**The AEM content delivery pipeline strips raw `<span class="icon icon-car">` elements** from `.plain.html` content files. EDS expects icons to be authored using the `:icon-name:` colon syntax in the document source, which AEM's decoration pipeline converts to icon spans.

In our `content/index.plain.html`, the icons were inserted as raw HTML:
```html
<span class="icon icon-car"></span>
```

On `localhost:3000`, the local dev server serves this HTML as-is, so icons render. But on `.aem.page`, the AEM delivery pipeline **sanitizes the HTML and removes empty `<span>` elements** — so the icons disappear.

## Evidence

| Environment | Icon `<span>` present | Icons render |
|-------------|----------------------|-------------|
| `localhost:3000` | Yes (served raw) | Yes |
| `.aem.page` | No (stripped by pipeline) | No |

DOM on `.aem.page` shows:
```
listitem → heading "Car" (no icon div/span before it)
```

Expected:
```
listitem → div.cards-homepage-card-icon → p → span.icon.icon-car → img
          → div.cards-homepage-card-body → heading "Car"
```

## Fix Required

The content for the product icon grid needs to use **AEM-compatible icon references**. Two options:

### Option A: Use `:icon-name:` Syntax in Document Authoring (Recommended)
Author the content in DA/Google Docs with `:car:`, `:home:`, etc. — AEM's pipeline will convert these to proper `<span class="icon icon-car">` during delivery.

### Option B: Use `<img>` Tags Instead of `<span>` Icons
Replace the icon spans with direct `<img src="/icons/car.svg">` tags in the HTML content — images are preserved by the pipeline.

```html
<!-- Instead of: -->
<span class="icon icon-car"></span>

<!-- Use: -->
<img src="/icons/car.svg" alt="Car" width="36" height="36">
```

## Checklist

- [x] Identify root cause — AEM pipeline strips empty `<span>` elements
- [x] Verify icons load individually on `.aem.page` (`/icons/car.svg` returns valid SVG)
- [x] Verify block JS deployed correctly (icon detection logic present)
- [x] Verify block CSS deployed correctly (icon-grid variant styles present)
- [ ] **Fix content** — Replace `<span class="icon icon-name">` with `<img src="/icons/name.svg">` tags in `content/index.plain.html`
- [ ] **Update block JS** — Adjust `cards-homepage.js` icon detection to handle `<img>` tags from `/icons/` path
- [ ] **Update block CSS** — Ensure `.cards-homepage-card-icon img` styling works for direct `<img>` elements
- [ ] **Verify on `.aem.page`** — Confirm icons render after fix is pushed
- [ ] **Update import parser** — Fix `cards-homepage.js` parser to generate `<img>` tags instead of icon spans for future imports

> **Execution of these fixes requires exiting plan mode.**
