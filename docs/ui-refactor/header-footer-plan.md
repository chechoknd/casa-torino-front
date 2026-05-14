# UI Refactor Plan — Header and Footer

This document outlines the planned visual refactor for the Header and Footer modules of the Casa Torino application.

## Files Found
- `src/app/shared/components/shell/shell.component.ts`: Contains the main layout, topbar (header), and footer.

## Current Visual Problems
- **Inconsistent Spacing:** Mix of arbitrary rem values and custom CSS classes.
- **Custom CSS Overhead:** Large internal `styles` block that can be simplified with Tailwind.
- **Visual Hierarchy:** Desktop user info and logout button could be more clearly distinguished.
- **Responsive Handling:** Complex custom media queries that can be replaced with Tailwind's mobile-first utilities.
- **Color Consistency:** Uses some CSS variables that might slightly differ from the new centralized guide.

## Planned Improvements
- **Standardize Colors:** Apply `text-[#1E3A0F]` for titles and `text-[#3B4A2F]` for body text.
- **Apply 8px System:** Replace `1rem` and `1.25rem` with Tailwind's `p-4`, `p-5`, `gap-4`, etc.
- **Modernize Topbar:**
  - Use `bg-[#EDE8DA]` (Beige-alt) and `border-[#C8BFA8]` for the container.
  - Refine user profile section with better typography and spacing.
  - Apply primary button styles to the Logout button.
- **Modernize Footer:**
  - Use `bg-[#EDE8DA]` for consistency.
  - Improve typography using `font-serif` for "Casa Torino".
  - Ensure clear separation of information.
- **Responsive Optimization:**
  - Use Tailwind's `md:` and `lg:` prefixes to handle layout transitions more elegantly.
  - Simplify mobile user menu positioning and styling.

## Risks
- **Shell Layout:** The header and footer are part of a grid layout in `ShellComponent`. Changes to their padding or margins must not break the overall workspace structure.
- **Mobile Menu Logic:** The refactor must not interfere with the `mobileMenuOpen` or `mobileUserMenuOpen` state management.
- **Angular Material Interop:** Ensuring Tailwind classes work well with `mat-button` and `mat-icon`.

## Implementation Checklist
- [ ] Backup current styles (done via research phase).
- [ ] Refactor Topbar (Header) template and classes.
- [ ] Refactor Footer template and classes.
- [ ] Simplify or remove corresponding CSS in the `styles` block.
- [ ] Validate responsive behavior (mobile, tablet, desktop).
- [ ] Verify functionality (logout, mobile menu toggle).
