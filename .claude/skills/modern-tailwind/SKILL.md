---
name: modern-tailwind
description: Write clean, modern, concise Tailwind CSS code. Use whenever working on or reviewing Tailwind CSS code.
---

# Tailwind CSS Best Practices (v4)

## CSS Variable Syntax — v4

When using CSS variables in arbitrary values, use the modern v4 shorter syntax.

Instead of:

```html
<div class="bg-[var(--color)]" />
```

write:

```html
<div class="bg-(--color)" />
```

## Theme Configuration — v4

Tailwind v4 uses **CSS-first configuration**. There is no `tailwind.config.ts`.

- Define all design tokens via `@theme` in `globals.css`
- Extend the theme in `globals.css` instead of a config file
- Use `@layer` for custom utilities and components when repetition is unavoidable
- Avoid `@apply` except for small, repeatable patterns

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-brand: #4f46e5;
  --radius-card: 0.75rem;
  --font-sans: "Inter", sans-serif;
}
```

## Layout Best Practices

Prefer grid for 2D layouts. Prefer flex for 1D alignment.

```html
<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <div class="flex items-center justify-between"></div>
</div>
```

## Core Principles

- Prefer utility classes over custom CSS for most styling
- Keep class lists readable by grouping: layout → spacing → typography → color → effects
- Use semantic HTML first; utilities should enhance, not replace structure

## Variants & State

- Use `hover`, `focus-visible`, `disabled`, `dark`, and `motion-safe` variants where appropriate
- Prefer `data-*` and `aria-*` variants for stateful styling tied to DOM semantics
  — this is the preferred pattern for bookmark card states (pinned, archived, selected)
- Use `group` and `peer` for parent/sibling state without extra JS

## Responsive Design

- Start with base (mobile) styles, then add responsive variants (`sm`, `md`, `lg`, ...)
- Use container query utilities when layout depends on parent size rather than viewport

## Dark Mode

- Dark mode is implemented via the `class` strategy on the `<html>` element
- Use the `dark:` variant for all dark mode styles
- All color tokens are defined as CSS custom properties in `globals.css` under `@theme`

## Maintainability

- Extract reusable UI into components instead of repeating large class strings
- Keep class names deterministic; avoid dynamic string concatenation when possible
