# AA Insurance Homepage Migration Plan

## Target Page

- **URL:** https://www.aainsurance.co.nz/
- **Title:** Award-winning home, contents & car Insurance | AA Insurance
- **Template:** Homepage

---

## Page Structure (from live inspection)

### Section 1: Header / Navigation
- Logo + Login link + Search button + Hamburger menu
- Sticky banner navigation

### Section 2: Hero Banner
- Large promotional headline: "Save $150 on new Home & Contents insurance & $50 on new Car insurance"
- Three CTA buttons: "Get a quote", "Start a claim", "Pay / Renew"
- Promo code details + Terms link

### Section 3: Product Icon Grid
- 13 product tiles in a scrollable row: Car, Home, Contents, Landlord, Small Business, Motorcycle, Recreation, Classic Car, Life, Health, Travel, Pet
- Each tile has an icon image + label + link
- Some marked as "Partner product"

### Section 4: Feature Spotlight
- Image: "People looking at computer"
- Heading: "We're here to help"
- Body text about weather preparedness
- "Learn more" link to `/prepare`

### Section 5: News / Announcement Cards
- 3 cards in a carousel/row:
  1. **Scam alert** — link to `/blog/at-home/scam-protection`
  2. **The Big Little Sponsorship 2026** — link to `/big-little`
  3. **Sustainability at AA Insurance** — link to `/about-us/sustainability`

### Section 6: "Why Choose AA Insurance" Value Props
- 3 value prop cards:
  1. "NZ's most trusted insurer" — link to `/awards`
  2. "We put you first" — link to `/contact`
  3. "Easy, stress-free claims" — link to `/claims`
- Each has icon + heading + description + link

### Section 7: Trust Badges Bar
- Fair Insurance Code badge + link
- Writemark badge + link
- S&P Financial Strength Rating badge + link

### Section 8: Footer
- 4-column link grid: Insurance, Tools & Guidance, Manage Policy, About
- Social media icons (Facebook, Instagram, TikTok, LinkedIn, YouTube, Email)
- Legal links row + copyright

---

## Migration Approach

1. **Site analysis** — Register homepage URL and classify its template
2. **Page analysis** — Deep-analyze the homepage to identify EDS block mappings for each section
3. **Design system extraction** — Capture colors, fonts, spacing, and brand tokens
4. **Block mapping** — Map each section to EDS blocks (hero, cards, columns, etc.)
5. **Import infrastructure** — Generate parsers/transformers for the homepage template
6. **Content import** — Run the import to produce EDS-compatible HTML
7. **Preview & QA** — Verify rendering against the original

---

## Checklist

- [ ] Run site analysis for homepage URL
- [ ] Run page analysis on `https://www.aainsurance.co.nz/`
- [ ] Extract design system (colors, fonts, spacing)
- [ ] Map sections to EDS blocks
- [ ] Generate import infrastructure (parsers + transformers)
- [ ] Import homepage content
- [ ] Preview and validate against original
- [ ] Fix any visual discrepancies

---

> **Note:** Execution requires exiting plan mode. Ready to proceed when approved.
