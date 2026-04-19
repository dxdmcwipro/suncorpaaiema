# Debug CSS Styles Not Applied

## Problem

CSS styles from `styles/styles.css` and block CSS files may not be fully applying to the migrated homepage at the preview. Need to diagnose root causes and fix.

## Investigation Findings# Debug CSS Styles — Investigation Results

## Current State

The investigation shows that **CSS styles ARE being applied correctly**. All stylesheets are loading and computed styles match the design tokens.

## Verified Working

| Item | Expected | Actual | Status |
|------|----------|--------|--------|
| `styles.css` loaded | Yes | `http://localhost:3000/styles/styles.css` | OK |
| `hero-promo.css` loaded | Yes | Loaded, block status: `loaded` | OK |
| `cards-homepage.css` loaded | Yes | Loaded, block status: `loaded` | OK |
| `columns-badges.css` loaded | Yes | Loaded, block status: `loaded` | OK |
| Body font | `arial, sans-serif` | `arial, sans-serif` | OK |
| Body color | `#262626` | `rgb(38, 38, 38)` | OK |
| H1 color | `#0d59bf` (AA blue) | `rgb(13, 89, 191)` | OK |
| H1 font-size | `32px` (mobile) | `32px` | OK |
| H1 font-weight | `700` | `700` | OK |
| Primary button bg | `#0d59bf` | `rgb(13, 89, 191)` | OK |
| Primary button color | `#fff` | `rgb(255, 255, 255)` | OK |
| Primary button radius | `8px` | `8px` | OK |
| Primary button padding | `12px 24px` | `12px 24px` | OK |
| Link color | `#0d59bf` | `rgb(13, 89, 191)` | OK |

## Known Non-CSS Issues (Console Errors)

| Error | Cause | Impact |
|-------|-------|--------|
| `nav.plain.html` 404 | Nav file is at `/content/nav.plain.html`, but EDS looks for `/nav.plain.html` at root | Header block fails to render |
| `footer.plain.html` 404 | Footer file is at `/content/footer.plain.html`, but EDS looks for `/footer.plain.html` at root | Footer block fails to render |

## Root Cause: Nav/Footer File Location

The header and footer blocks fail because EDS expects `nav.plain.html` and `footer.plain.html` at the **site root** (`/`), not inside `/content/`. The files need to be moved or symlinked.

## Checklist

- [x] Verify `styles/styles.css` is loaded and applied
- [x] Verify all block CSS files load (`hero-promo`, `cards-homepage`, `columns-badges`)
- [x] Verify all 3 blocks have `data-block-status="loaded"`
- [x] Verify design tokens (colors, fonts, spacing) match original site values
- [x] Verify button styling (primary/secondary) rendering correctly
- [x] Identify header 404 — `nav.plain.html` not found at root path
- [x] Identify footer 404 — `footer.plain.html` not found at root path
- [ ] **Fix:** Move `content/nav.plain.html` → root `nav.plain.html` (or create symlink)
- [ ] **Fix:** Move `content/footer.plain.html` → root `footer.plain.html` (or create symlink)

## Conclusion

**CSS styles are fully applied and working.** The only visual gaps are:
1. **Header/Footer not rendering** — file location issue (nav/footer files in wrong directory)
2. **Product icon grid missing icons** — original uses inline SVG sprites (not a CSS issue)

> Execution of the two file-move fixes requires exiting plan mode.
