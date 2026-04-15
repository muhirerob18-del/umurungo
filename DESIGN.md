# Design Brief — Premium E-Commerce Marketplace

## Visual Direction
**Premium Modern Minimalist Editorial Gallery.** Refined, curated aesthetic emphasizing trust and efficiency over sale-driven urgency. Warm neutral foundation with surgical teal-green accents. Ample whitespace, clean card layering, readable typography. Dual-panel design (admin + user storefront) with intentional visual hierarchy.

## Tone
Editorial curation meets utilitarian precision. Think contemporary luxury marketplace (Farfetch) rather than discount-driven flash sales. Trustworthy, professional, approachable.

## Color Palette (Light Mode Primary)

| Name | OKLCH | Hex | Purpose |
|------|-------|-----|---------|
| Background | 0.96 0.02 73 | #faf8f3 | Primary surface, warm cream |
| Foreground | 0.22 0.01 240 | #3a3a3a | Primary text, rich charcoal |
| Card | 1.0 0.01 73 | #fffdf8 | Elevated cards |
| Primary (Accent) | 0.58 0.11 172 | #4a8b7f | CTAs, highlights, teal-green |
| Muted | 0.72 0.01 73 | #b8b4aa | Secondary elements |
| Destructive | 0.55 0.22 25 | #c73030 | Errors, delete actions |
| Border | 0.92 0.01 73 | #e8e4da | Subtle dividers |

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | DM Sans | 600 | Headers, product titles, hero |
| Body | Figtree | 400/500 | Copy, descriptions, UI text |
| Mono | JetBrains Mono | 400 | Admin stats, pricing, code |

## Elevation & Depth
- **Subtle shadows** (0.06 alpha): Default card borders, subtle interaction feedback
- **Elevated shadows** (0.08 alpha): Modal overlays, dropdown menus, prominent cards
- **No blur/glow effects**: Maintain clarity and premium restraint

## Structural Zones
- **Header/Nav**: `bg-card`, `border-b` (neutral subtle separator)
- **Content**: Alternating `bg-background` and `bg-card` for rhythm
- **Sidebar (Admin)**: `bg-sidebar` (soft off-white), `border-r` (neutral)
- **Footer**: `bg-muted/20`, `border-t`, subtle divider
- **Cards**: `bg-card`, `shadow-card`, gentle rounded corners (6px)

## Spacing & Rhythm
- Base unit: 4px. Scale: 8, 12, 16, 24, 32, 48 px
- Product cards: 16px internal padding, 16px gap between cards
- Mobile-first: 2-col grid (mobile), 3-col (tablet), 4-col (desktop)
- Ample negative space around focal elements

## Component Patterns
- **Product Card**: Image + title + price + action button (minimal, no sparkle)
- **Button Hierarchy**: Primary (teal accent), Secondary (muted text), Ghost (transparent)
- **Form Inputs**: Clear borders on focus, no floating labels (inline placeholder)
- **Admin Dashboard**: Data tables with subtle borders, chart colors from palette

## Motion
- **Transition default**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` on interactive elements
- **No entrance animations**: Content loads, no bounce/zoom effects
- **Hover feedback**: Subtle background shift, shadow lift

## Dark Mode
Inverted lightness, maintained saturation. Background: `0.12` (near-black), Text: `0.96` (off-white), Accent: `0.65` (lighter teal). Used sparingly; light mode is primary.

## Signature Detail
**Card breathing room**: Product cards with intentional padding, letting images dominate. Admin panels with whitespace separating data zones, never cramped. Visual clarity over density.

## Constraints
- No generic blue, no rainbow gradients, no bootstrap defaults
- Neutral palette with surgical accent placement (primary, accent only)
- Chart colors tie to palette (primary + supporting hues)
- Responsive breakpoints: mobile (320px), tablet (768px), desktop (1024px+)
