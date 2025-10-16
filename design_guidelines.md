# Design Guidelines: Photography Portfolio Website

## Design Approach: Reference-Based (Photography Platform Inspiration)

**Primary References**: Unsplash, Format, Behance photography portfolios
**Design Philosophy**: Photo-first minimalism where imagery dominates, UI recedes

**Key Principles**:
- Images command attention; interface elements serve, never compete
- Negative space amplifies visual impact
- Restrained color palette keeps focus on photography
- Seamless transitions between collections maintain flow

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Background: 0 0% 99% (near-white canvas)
- Text Primary: 0 0% 10% (deep charcoal)
- Text Secondary: 0 0% 45% (medium gray)
- Accent: 0 0% 20% (understated dark for CTAs)
- Borders: 0 0% 92% (subtle dividers)

**Dark Mode**:
- Background: 0 0% 8% (rich black)
- Text Primary: 0 0% 95% (soft white)
- Text Secondary: 0 0% 65% (muted gray)
- Accent: 0 0% 85% (light accent for CTAs)
- Borders: 0 0% 18% (subtle separation)

### B. Typography

**Font Stack**: Inter (via Google Fonts CDN) for clean, professional readability
- Headings: font-light tracking-tight (thin weight for elegance)
- Page Titles: text-4xl to text-6xl
- Section Headers: text-2xl to text-3xl
- Body Text: text-base font-normal leading-relaxed
- Captions/Metadata: text-sm font-light text-secondary

### C. Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 24 (harmonious vertical rhythm)
- Section padding: py-16 to py-24 (generous breathing room)
- Component gaps: gap-4 to gap-8
- Container max-width: max-w-7xl (spacious galleries)

### D. Component Library

**Navigation**:
- Minimal top nav: Logo left, nav links center/right, sticky on scroll
- Links: Understated hover underline animation
- Mobile: Slide-in menu overlay with blur backdrop

**Photo Grid Patterns**:
- Masonry layout on homepage (Pinterest-style, 2-4 columns responsive)
- Uniform grid for collections (3-4 columns, equal aspect ratios)
- Lightbox/modal for full-resolution viewing with subtle zoom
- Image lazy loading with blur-up placeholder

**Collection Cards**:
- Cover image with gradient overlay (dark bottom for text legibility)
- Title overlay at bottom-left: text-2xl font-light
- Hover: subtle scale transform (1.02) with 300ms ease
- Metadata below: Photo count, update date (text-sm)

**Forms** (Collections Management):
- Minimal input styling: border-b-2 focus states only
- Upload area: Dashed border drag-drop zone
- Inline validation with micro-feedback

**CTAs/Buttons**:
- Primary: Solid dark background, rounded-lg px-8 py-3
- Ghost/Outline: When on images, backdrop-blur-sm bg-white/10 border

### E. Animations

Use sparingly - only where enhancing UX:
- Image fade-in on scroll (opacity + subtle translate-y)
- Hover scale on collection cards (transform scale-[1.02])
- Lightbox open/close: fade + scale from clicked position
- Page transitions: Minimal crossfade (200ms)

---

## Page-Specific Layouts

### Homepage (Photo-First Gallery)
- Hero: NO traditional hero section
- Instead: Immediate masonry photo grid (occupies ~85% viewport top)
- Minimal header floats over grid (absolute positioning, subtle backdrop-blur)
- Grid: 1 column mobile, 2 tablet, 3-4 desktop with varying heights
- Footer: Minimal copyright + social links (py-12)

### Collections Page
- Page title: Centered, py-16 with subtitle
- Grid layout: 2 columns tablet, 3-4 desktop with uniform aspect (16:9)
- Each card: Collection cover + title + metadata
- Sorting/filter controls: Minimal top-right dropdown

### Individual Collection View
- Collection title + description header (py-12)
- Photo grid: Similar to homepage but uniform aspect ratios
- Back to collections: Subtle breadcrumb/link top-left

### Admin/Management Interface
- Side navigation panel (Collections, Upload, Settings)
- Drag-drop reordering for photo sequences
- Inline editing for titles/descriptions
- Clean table view for bulk actions

---

## Images & Media Strategy

**Homepage**: 
- NO hero image banner
- Masonry grid with 15-20 high-quality portfolio photos immediately visible
- Photos: Various orientations (portrait, landscape, square mix)
- Aspect ratios preserved, no forced crops

**Collections Page**:
- Collection cover images: 16:9 aspect, high-impact selections
- Background blur or gradient overlay ensures text readability

**Individual Collections**:
- Gallery grid of collection photos (consistent aspect for rhythm)
- Full-resolution lightbox on click

**Image Optimization**:
- Responsive images with srcset for device optimization
- WebP format with JPEG fallback
- Progressive loading with LQIP (low-quality placeholder)

---

## Accessibility & Polish

- Focus states: 2px offset ring in accent color
- Keyboard navigation for grid (arrow keys in lightbox)
- Alt text mandatory for all images
- ARIA labels for icon-only buttons
- Skip to content link for screen readers
- Consistent dark mode across all inputs/modals

**Performance Targets**:
- Lazy load images below fold
- Infinite scroll or pagination for large collections
- Image CDN integration for optimized delivery
- Preload critical above-fold images