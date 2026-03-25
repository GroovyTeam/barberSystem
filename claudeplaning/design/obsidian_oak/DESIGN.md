```markdown
# Design System Strategy: The Modern Craftsman

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** This system moves away from the sterile, modular look of standard SaaS platforms and moves toward a high-end editorial experience. It is inspired by the tactile nature of a premium barbershop: the grain of walnut wood, the sheen of a straight razor, and the warmth of low-hanging Edison bulbs.

To break the "template" feel, we employ **Intentional Asymmetry**. Hero sections should utilize oversized, offset typography and overlapping imagery where a "Warm Wood Brown" element might partially obscure a "Deep Black" surface. This layering creates physical depth, making the interface feel like a curated workspace rather than a flat screen.

---

## 2. Color & Atmosphere
This palette is designed to evoke leather, smoke, and gold. We use dark modes not just for utility, but for a sense of "exclusive darkness."

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections or separate content. Boundaries must be defined solely through:
- **Background Color Shifts:** Moving from `surface` (#131313) to `surface-container-low` (#1C1B1B).
- **Tonal Transitions:** Using the `spacing-16` or `spacing-20` tokens to create breathing room that acts as a natural separator.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials.
- **Base Layer:** `surface` (#131313).
- **Secondary Surfaces (Cards):** Use `surface-container` (#201F1F).
- **Elevated Details:** Use `surface-container-high` (#2A2A2A) for active states or nested elements.
Instead of a flat grid, an inner container should use a slightly higher tier (brighter) to define its importance, mimicking a tray sitting on a workbench.

### Signature Textures & Glass
- **The "Gold Glimmer":** Use a subtle linear gradient on primary CTAs transitioning from `primary` (#F9BA82) to `primary-container` (#8B5A2B) at a 135-degree angle. This simulates the light hitting polished wood.
- **Glassmorphism:** For floating navigation or modal overlays, use `surface-variant` (#353534) at 70% opacity with a `20px` backdrop-blur. This keeps the "warmth" of the background visible while providing clear legibility.

---

## 3. Typography: The Editorial Voice
We utilize a high-contrast scale to mirror luxury magazines.

*   **Display & Headlines (Epilogue):** This font carries the "Modern Traditional" weight. `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to feel authoritative and masculine.
*   **Body & Labels (Inter):** Inter provides a clean, functional contrast to the expressive Epilogue. Use `body-md` (0.875rem) for most descriptions to maintain an airy, sophisticated feel.
*   **The Hierarchy:** Use `secondary` (#E7C187) for `title-sm` accents to act as a "gold leaf" highlight against the `on-surface` (#E5E2E1) body text.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not structural lines.

*   **Ambient Shadows:** If an element must float (like a "Book Now" FAB), use a shadow with a 24px blur and 6% opacity. The shadow color should be a tinted version of `primary-fixed-dim` to simulate the warm glow of the shop’s lighting.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. Never use a 100% opaque border.
*   **Depth through Blur:** Use `surface-container-lowest` (#0E0E0E) for background elements that are "pushed back" in the z-index, creating a sense of an infinite, dark room.

---

## 5. Components

### Buttons (The "Brass & Wood" Style)
*   **Primary:** Solid `primary-container` (#8B5A2B) with `on-primary-container` (#FFDDC2) text. Roundedness: `md` (0.375rem).
*   **Secondary:** Ghost style. No background, `outline` (#9E8E82) "Ghost Border" at 20%, with text in `secondary` (#E7C187).
*   **States:** On hover, primary buttons should shift to `primary` (#F9BA82) to simulate a "lit" effect.

### Input Fields
*   **Architecture:** Use `surface-container-low` as the fill. 
*   **Bottom-Heavy:** Instead of a full box, use a 2px bottom-bar of `outline-variant` that transitions to `primary` (#F9BA82) on focus.
*   **Labels:** Always use `label-md` in `secondary-fixed-dim` for a "gold label" look.

### Cards & Lists
*   **The No-Divider Rule:** Forbid the use of horizontal lines. To separate barber profiles or service types, use `spacing-4` (1.4rem) of vertical white space or a subtle shift from `surface-container` to `surface-container-high`.
*   **Visual Interest:** Incorporate an "Icon Watermark"—a large, 5% opacity `secondary` icon (e.g., scissors) tucked into the corner of the card.

### Signature Component: The "Service Drawer"
Instead of a standard dropdown, use a full-width expansion tile that uses `surface-bright` (#3A3939) to "lift" the service details out of the dark background, utilizing `spacing-6` for internal padding.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetric Padding:** Allow text to breathe. Use `spacing-12` on one side and `spacing-16` on the other for an editorial feel.
*   **Embrace the Dark:** Keep 90% of the UI in the `surface` to `surface-container-low` range.
*   **Color as Accents:** Use Gold (`secondary`) only for high-value interactions like "Confirm Appointment."

### Don’t:
*   **Don’t use "Pure White" for large text blocks:** Use `light-beige/cream` (#F5F0E8) to reduce eye strain and maintain the "warm" atmosphere.
*   **Don’t use standard `lg` (0.5rem) rounding everywhere:** Stick to `md` (0.375rem) for a sharper, more masculine edge, or `none` (0px) for high-impact hero imagery.
*   **Don’t use shadows on every card:** Let the background color shifts do the work. Only shadow elements that literally "hover" over others.

### Accessibility Note:
While we lean into a "dark and moody" aesthetic, ensure all `body-md` text sitting on `surface` backgrounds maintains a contrast ratio of at least 4.5:1 by using the `on-surface` (#E5E2E1) token.```