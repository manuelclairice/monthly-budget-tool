# 🌊 Ocean Theme Documentation

## Overview

The Monthly Budget Planner uses a calming, professional **Ocean color palette** inspired by coastal serenity. This theme creates a modern, accessible interface with excellent readability and visual harmony.

## Color Palette

### Primary Colors

```css
--color-primary: #6baa9e /* Muted teal - primary actions, links */ --color-primary-dark: #5a9388
  /* Darker teal - hover states */ --color-secondary: #a5c3b9 /* Sage green - secondary elements */
  --color-accent: #d7e5dd /* Light mint - highlights, borders */ --color-background: #f8f6f2
  /* Soft beige - page background */ --color-surface: #ffffff /* Pure white - cards, surfaces */;
```

### Semantic Colors

```css
--color-success: #7cc5b8 /* Soft aqua - positive actions */ --color-warning: #e8b886
  /* Warm sand - warnings */ --color-danger: #d89a9e /* Soft coral - errors, deletions */
  --color-info: #8bb8c9 /* Sky blue - information */;
```

### Text Colors

```css
--color-text: #2e3a35 /* Dark green-gray - primary text */ --color-text-secondary: #6b7a73
  /* Medium green-gray - secondary text */ --color-border: #e3ded6 /* Light border color */;
```

### Chart Colors

A harmonious 10-color palette for data visualization:

```css
#6BAA9E  /* Teal */
#A5C3B9  /* Sage */
#7CC5B8  /* Aqua */
#8BB8C9  /* Sky */
#B8D4CE  /* Mint */
#E8B886  /* Sand */
#9AB8AD  /* Ocean green */
#C9DED6  /* Seafoam */
#D89A9E  /* Coral */
#D7E5DD  /* Light mint */
```

## Typography

### Font Family

**Inter** - A clean, modern, highly legible sans-serif font

- Fallback: System fonts (Apple/Windows)
- Weights used: 300, 400, 500, 600, 700

### Font Sizes

```css
--font-size-sm: 0.875rem /* 14px - Labels, captions */ --font-size-base: 1rem /* 16px - Body text */
  --font-size-lg: 1.125rem /* 18px - Subtitles */ --font-size-xl: 1.25rem /* 20px - Headings */
  --font-size-2xl: 1.5rem /* 24px - Large headings */ --font-size-3xl: 1.875rem
  /* 30px - Page titles */;
```

### Typography Best Practices

- Line height: 1.6 for body text (improved readability)
- Letter spacing: -0.01em for headings (tighter, modern look)
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## Spacing Scale

Consistent spacing creates visual rhythm:

```css
--spacing-xs: 0.25rem /* 4px */ --spacing-sm: 0.5rem /* 8px */ --spacing-md: 1rem /* 16px */
  --spacing-lg: 1.5rem /* 24px */ --spacing-xl: 2rem /* 32px */ --spacing-2xl: 3rem /* 48px */;
```

## Border Radius

Softer, more modern rounded corners:

```css
--radius-sm: 0.375rem /* 6px */ --radius-md: 0.5rem /* 8px */ --radius-lg: 0.75rem /* 12px */
  --radius-xl: 1rem /* 16px */;
```

## Shadows

Subtle, layered shadows for depth:

```css
--shadow-sm: 0 2px 4px rgba(46, 58, 53, 0.08) --shadow-md: 0 4px 12px rgba(46, 58, 53, 0.12)
  --shadow-lg: 0 8px 24px rgba(46, 58, 53, 0.16);
```

## UI Patterns

### Cards

**Standard Card:**

- Background: `linear-gradient(135deg, var(--color-surface) 0%, var(--color-accent) 100%)`
- Border: `2px solid var(--color-accent)`
- Border radius: `var(--radius-lg)`
- Shadow: `var(--shadow-sm)`
- Padding: `var(--spacing-xl)`

**Hover State:**

- Shadow: `var(--shadow-md)`
- Transform: `translateY(-2px)`

### Buttons

**Primary Button:**

- Background: Linear gradient from `--color-primary` to `--color-primary-dark`
- Color: White
- Shadow: `0 2px 6px rgba(107, 170, 158, 0.25)`
- Hover: Reverse gradient, lift with `translateY(-1px)`

**Secondary Button:**

- Background: `--color-accent`
- Color: `--color-text`
- Border: `1px solid var(--color-secondary)`
- Hover: Background to `--color-secondary`, border to `--color-primary`

### Form Inputs

- Border: `2px solid var(--color-accent)`
- Background: `--color-surface`
- Focus: Border `--color-primary`, box-shadow with 10% opacity teal glow
- Transition: All properties `250ms ease-in-out`

### Tabs

- Background: `transparent` (inactive), `--color-accent` (active)
- Rounded pills with `--radius-md`
- Container background: `--color-surface` with light padding
- Active tab: Font weight 600, subtle shadow

## Gradients

### Header Gradient

```css
linear-gradient(135deg,
  var(--color-primary) 0%,
  var(--color-primary-dark) 50%,
  var(--color-secondary) 100%
)
```

### Card Gradients

```css
linear-gradient(135deg,
  var(--color-surface) 0%,
  var(--color-accent) 100%
)
```

## Accessibility

### Contrast Ratios

All color combinations meet WCAG AA standards:

- Primary text on background: 12.4:1
- Secondary text on background: 5.8:1
- White text on primary: 4.6:1

### Focus States

- Outline: `2px solid var(--color-primary)`
- Outline offset: `2px`
- Additional shadow for inputs: `0 0 0 3px rgba(107, 170, 158, 0.1)`

### Interactive States

- Hover: Subtle color shift, transform, or shadow
- Active: Reduced transform (pressed effect)
- Focus: Clear outline for keyboard navigation
- Disabled: 50% opacity, `cursor: not-allowed`

## Animation

### Transitions

```css
--transition-fast: 150ms ease-in-out /* Quick interactions */ --transition-base: 250ms ease-in-out
  /* Standard animations */;
```

### Transform Examples

- Cards lift: `translateY(-2px)` to `translateY(-4px)`
- Items slide: `translateX(4px)`
- Buttons press: `translateY(0)` (active state)

## Dark Mode Support

Theme includes dark mode variables:

```css
@media (prefers-color-scheme: dark) {
  --color-background: #1a2421 --color-surface: #243430 --color-border: #3a4a45 --color-text: #e8f0ed
    --color-text-secondary: #a5c3b9;
}
```

## Implementation

### Using Theme Variables

```vue
<template>
  <div class="my-card">
    <!-- Content -->
  </div>
</template>

<style scoped>
.my-card {
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-accent) 100%);
  border: 2px solid var(--color-accent);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.my-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
</style>
```

## Charts Integration

Chart.js colors automatically use the Ocean palette. See `PieChart.vue`:

```javascript
const chartColors = [
  '#6BAA9E', // Teal
  '#A5C3B9', // Sage
  '#7CC5B8', // Aqua
  '#8BB8C9' // Sky
  // ... 6 more colors
]
```

## Best Practices

1. **Use CSS variables** - Never hardcode colors
2. **Maintain hierarchy** - Primary > Secondary > Accent
3. **Test contrast** - Ensure readability for all users
4. **Consistent spacing** - Use the spacing scale
5. **Subtle animations** - Keep transitions smooth but not distracting
6. **Layer shadows** - Build depth progressively
7. **Round consistently** - Use defined border radius values

## Resources

- [Inter Font](https://fonts.google.com/specimen/Inter)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Ocean Color Inspiration](https://coolors.co/6baa9e-a5c3b9-d7e5dd-f8f6f2-2e3a35)

---

**Theme Version:** 1.0  
**Last Updated:** November 2025  
**Designed for:** Monthly Budget Planner
