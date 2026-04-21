# Prepare Page Discovery & Migration Plan

## Page Overview

**Source URL**: https://www.aainsurance.co.nz/prepare
**Page Title**: "We're here to help" — Event Preparedness Guide
**Current Status**: Not yet migrated (no content file exists at `content/prepare`)

---

## Page Structure & Layout Analysis

The Prepare page follows an **Informational Guide** layout with the following sections from top to bottom:

### Section 1 — Hero Banner
- Full-width banner image (event preparation theme)
- Heading: "We're here to help"
- Introductory paragraph about weather events and natural hazards
- **Candidate block**: `hero` (already exists locally)

### Section 2 — Action Callout Cards (3-column)
- Three cards: "Stay safe", "Stay away", "Stay informed"
- Each with a brief description of what to do
- **Candidate block**: `columns` (already exists locally) or `cards`

### Section 3 — Resource Links
- Section heading about preparing for events
- Bulleted list of 5 linked resources (mix of internal and external)
  - Home natural hazard risk
  - NHCover
  - Get Ready NZ (external)
  - Home emergency kit
  - Natural hazards portal (external)
- **Candidate block**: Default content (heading + unordered list with links)

### Section 4 — Emergency Contact CTA
- Phone number: `0800 500 216`
- Prominent call-to-action
- **Candidate block**: Default content or a simple CTA pattern

### Section 5 — Collapsible Event Sections (x6)
Each event type is a collapsible/accordion section with Before/During/After subsections:

| Event Type | Subsections |
|---|---|
| Flood | Before / During / After |
| Storm & Cyclone | Before / During / After |
| Earthquake | Before / During / After |
| Landslide | Before / During / After |
| Tsunami | Before / During / After |
| Volcanic Activity | Before / During / After |

Each subsection contains bulleted lists with step-by-step guidance.
- **Candidate block**: **New `accordion` block needed** — no existing block handles collapsible sections

### Section 6 — Photo Documentation Guidelines
- Guidance for damage documentation photos
- Link to help article
- **Candidate block**: Default content or `columns`

### Section 7 — Claims CTA
- "Claim after a natural hazard" link
- Emergency phone number repeated
- **Candidate block**: Default content

---

## Blocks Inventory

### Existing Blocks (available locally)
| Block | Status | Usable for this page? |
|---|---|---|
| `hero` | Exists | Yes — for hero banner |
| `columns` | Exists | Yes — for 3-column action cards |
| `columns-badges` | Exists | Maybe — depending on styling needs |
| `cards` | Exists | Alternative for action cards |
| `cards-homepage` | Exists | Not needed |
| `header` | Exists | Already working |
| `footer` | Exists | Already working |
| `fragment` | Exists | Utility block |
| `hero-promo` | Exists | Not needed |

### New Blocks Required
| Block | Purpose |
|---|---|
| `accordion` | Collapsible Before/During/After sections for 6 event types |

---

## Internal Links from This Page
- `/living-room/natural-hazards/home-natural-hazard-risk`
- `/nhcover`
- `/living-room/natural-hazards/claim-after-storm-or-flood`
- `/living-room/natural-hazards/claim-after-natural-hazard`
- `/help/article/7541644147855-What-kind-of-photos-are-needed-for-my-insurance-claim-and-why`
- `/blog/natural-hazards/home-emergency-kit`

## External Links from This Page
- `https://getready.govt.nz/emergency`
- `https://www.civildefence.govt.nz/`
- `https://www.nzta.govt.nz/`
- `https://www.naturalhazardsportal.govt.nz/s/`
- `https://teara.govt.nz/en/map/4416/new-zealand-regions-at-greatest-risk-of-ground-shaking`
- `https://www.civildefence.govt.nz/get-ready/get-tsunami-ready/tsunami-evacuation-zones/`
- `tel:0800500216`

---

## Design Tokens Already in Place
- AA Insurance brand colors (`--aa-yellow`, `--aa-blue`, `--aa-dark-grey`, etc.)
- Font families (fs_lola_web for H1, Arial for body)
- Responsive breakpoints at 600px / 900px / 1200px

---

## Checklist

- [x] Fetch and analyze the source page at aainsurance.co.nz/prepare
- [x] Identify all sections and content blocks
- [x] Map sections to existing blocks
- [x] Identify new blocks required (accordion)
- [x] List all internal and external links
- [x] Verify local design tokens are ready
- [ ] Run page analysis skill (`excat-page-analysis`) for detailed block mapping and screenshots
- [ ] Create `accordion` block (JS + CSS) for collapsible event sections
- [ ] Generate import infrastructure (parsers + transformers) for this page template
- [ ] Import page content to `content/prepare.html`
- [ ] Preview and verify rendering at localhost
- [ ] Compare visual output with original page and fix styling gaps

> **Note**: Implementation requires switching to Execute mode.
