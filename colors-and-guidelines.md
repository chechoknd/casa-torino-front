# Casa Torino - Official Design Guidelines

This file is the **ONLY AUTHORITY** for visual design rules in the Casa Torino project. All AI agents and developers must strictly adhere to these guidelines to ensure UI/UX consistency.

---

## 🎨 Brand Identity & Colors
**Style:** Organic · Warm · Professional · Modern Mediterranean
**Visual Tone:** Refined yet accessible. Premium SaaS experience.

### Color Palette (Military Green & Cream)
The primary identity uses a warm cream background and military green for accents and actions.

| Category | Token | Hex | Tailwind Class | Usage |
|---|---|---|---|---|
| **Backgrounds** | `--color-bg` | `#F5F0E8` | `bg-[#F5F0E8]` | General page background |
| | `--color-bg-alt` | `#EDE8DA` | `bg-[#EDE8DA]` | Cards, sidebars, inputs |
| | `--color-surface` | `#FAF8F3` | `bg-[#FAF8F3]` | Modals, popovers, surfaces |
| **Brand (Green)** | `--color-primary` | `#2D5016` | `bg-[#2D5016]` | Primary buttons, active icons |
| | `--color-primary-hover` | `#3D6B20` | `hover:bg-[#3D6B20]` | Button hover states |
| | `--color-primary-muted` | `#D4E6C3` | `bg-[#D4E6C3]` | Status backgrounds, light badges |
| **Text** | `--color-text-primary`| `#1E3A0F` | `text-[#1E3A0F]` | Titles, important headings |
| | `--color-text-body` | `#3B4A2F` | `text-[#3B4A2F]` | Standard body paragraphs |
| | `--color-text-muted` | `#7A8C6E` | `text-[#7A8C6E]` | Subtitles, placeholders, labels |
| | `--color-text-inverse`| `#F5F0E8` | `text-[#F5F0E8]` | Text over dark backgrounds |
| **Borders** | `--color-border` | `#C8BFA8` | `border-[#C8BFA8]` | Neutral warm borders |

### Shadows & Depth
- **Small (`--shadow-sm`):** `shadow-[0_1px_3px_rgba(30,58,15,0.08)]` (Default cards)
- **Medium (`--shadow-md`):** `shadow-[0_4px_12px_rgba(30,58_15,0.10)]` (Hover states)
- **Large (`--shadow-lg`):** `shadow-[0_8px_24px_rgba(30,58_15,0.12)]` (Modals, dropdowns)

---

## ✍️ Typography
- **Headings:** `font-serif` ('Playfair Display', 'Lora') — Elegant Mediterranean character.
- **Body & UI:** `font-sans` ('DM Sans', 'Outfit') — Modern, clean legibility.
- **Monospace:** `font-mono` ('DM Mono') — Prices, codes, IDs.

---

## 📐 Spacing & Grid (8px System)
All spacing (margin, padding, gap) MUST be a multiple of **8px**.

- **4px:** `gap-1` / `p-1` (Min gaps)
- **8px:** `gap-2` / `p-2` (Badges/Chips)
- **16px:** `gap-4` / `p-4` (Standard padding/inputs)
- **24px:** `gap-6` / `p-6` (Card padding)
- **32px:** `gap-8` / `p-8` (Section margins)

---

## 🧱 Component Styling

### Buttons
- **Primary:** `bg-[#2D5016] text-white rounded-[8px] px-5 py-3 hover:bg-[#3D6B20] transition-colors`
- **Secondary:** `border-2 border-[#2D5016] text-[#2D5016] bg-transparent rounded-[8px] px-5 py-3 hover:bg-[#F5F0E8]`
- **Danger:** `bg-[#8B2E2E] text-white`

### Cards
- **Base:** `bg-[#EDE8DA] border border-[#C8BFA8] rounded-[12px] p-6 shadow-sm`
- **Hover:** `hover:shadow-md transition-all duration-200`

### Inputs
- **Base:** `bg-[#FAF8F3] border border-[#C8BFA8] rounded-[8px] px-[14px] py-[10px] focus:ring-2 focus:ring-[#2D5016] focus:border-transparent outline-none`

---

## 📱 Responsive Guidelines (Mobile-First)
- **Breakpoints:** `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- **Mobile Navigation:** Hamburger menu with smooth overlay.
- **Tables:** Adapt to cards on mobile or allow horizontal scroll with fade indicators.
- **Touch Targets:** Buttons and interactive elements should be at least **44x44px** on mobile.

---

## 🚫 Prohibitions
- **NO Pure White (`#FFFFFF`):** Use `--color-surface` or `--color-bg`.
- **NO Pure Black (`#000000`):** Use `--color-text-primary`.
- **NO Neutral Grays:** Always use warm, olive-toned grays (e.g., `#7A8C6E`).
- **NO Arbitrary Units:** Stick to the 8px system.
- **NO Modernization Refactors:** Do not redesign existing layouts without explicit instructions.

---

# UI Change Safety Levels

## SAFE
- spacing adjustments
- typography consistency
- button consistency
- border radius normalization
- color consistency

## MEDIUM
- component internal restructuring
- responsive adjustments

## DANGEROUS
- layout redesign
- navigation redesign
- changing component hierarchy
- changing DOM structure massively
- replacing Tailwind patterns
- changing routing-related UI

Agents MUST request confirmation before DANGEROUS changes.
