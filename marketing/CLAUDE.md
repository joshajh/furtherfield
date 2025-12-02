# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This Coastal Town - A Next.js 16 marketing website for Furtherfield events with a maritime/coastal aesthetic theme.

**Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Framer Motion, Keystatic CMS

## Commands

```bash
pnpm dev      # Start dev server (localhost:3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture

### App Router Structure
- `app/page.tsx` - Homepage with event grid
- `app/events/[slug]/` - Dynamic event detail pages
- `app/keystatic/` - CMS admin UI
- `app/api/keystatic/` - CMS API handler

### Components (`/components`)
All components exported via barrel file (`index.ts`). Key components:
- `Navigation.tsx` - Responsive header with mobile menu (Framer Motion)
- `TidalGrid.tsx` - Interactive SVG with maritime-themed wave animations
- `EventCard.tsx` - Event display with `Event` type export
- `Button.tsx` - Reusable button (3 variants: primary, secondary, outline)

### Content Management (Keystatic)
- **Storage:** Local files in `/content`
- **Collections:** `events` (workshops, performances, exhibitions, etc.), `pages`
- **Singleton:** `settings` (site title, tagline, hero, CTA)
- **Access:** `/keystatic` route for admin UI

## Styling Conventions

- CSS variables defined in `globals.css` for colors and spacing
- Color scheme: Dark background (#0F0E0E), light text (#F6F8FB), blue-to-purple gradients
- Responsive breakpoints use `md:` prefix
- Container spacing: `--spacing-container: 2.5` (10px unit)
- Fonts: Geist Sans/Mono, Instrument Serif, Playfair Display

## Code Patterns

- Client components explicitly marked with `'use client'`
- TypeScript interfaces for all component props
- Path alias: `@/*` maps to root directory
- Complex animations use Framer Motion; simple transitions use CSS
- Remote images configured for: Unsplash, Figma
