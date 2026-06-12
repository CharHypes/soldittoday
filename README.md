# SOLD IT TODAY — Luxury Real Estate Website

A modern, boutique, high-converting one-page website for **SOLD IT TODAY**, the Southeast Michigan real estate brand led by **Charlotte Hypes**. Built with the **Mulberry Noir** design direction — dark luxury, editorial layout, and an Awwwards-inspired feel.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS 3**
- **Framer Motion** (scroll reveals, carousel, hero motion)
- **next/font** (Poppins)
- **next/image** (optimized placeholder property imagery)

---

## Getting Started

> Requires **Node.js 18.17+** (Node 20 LTS recommended).

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the site
# http://localhost:3000
```

### Production build

```bash
npm run build
npm run start
```

---

## Project Structure

```
soldittoday-website/
├── app/
│   ├── globals.css        # Tailwind layers, palette vars, grain texture
│   ├── layout.tsx         # Root layout, Poppins font, metadata
│   └── page.tsx           # Homepage — composes all sections
├── components/
│   ├── ui/
│   │   ├── Reveal.tsx      # Scroll-reveal wrapper (reduced-motion aware)
│   │   └── SectionHeading.tsx
│   ├── Navbar.tsx         # Sticky nav + mobile menu
│   ├── Hero.tsx           # Editorial hero, CTAs, stat strip
│   ├── About.tsx          # Charlotte Hypes / brand story
│   ├── Services.tsx       # Service cards
│   ├── Listings.tsx       # Property cards + status pills
│   ├── WhyWorkWithUs.tsx  # Cream contrast section
│   ├── Market.tsx         # Southeast Michigan area grid
│   ├── Testimonials.tsx   # Auto-rotating carousel
│   ├── Contact.tsx        # Lead-capture form (front-end demo)
│   └── Footer.tsx
├── lib/
│   └── data.ts            # All placeholder data (listings, services, etc.)
├── tailwind.config.ts     # Mulberry Noir palette + tokens
└── next.config.mjs        # Remote image config (Unsplash)
```

---

## Customizing

Almost everything is data-driven. Open **`lib/data.ts`** to edit:

- `listings` — featured properties (title, price, beds/baths, status, image)
- `services` — service cards
- `testimonials` — client quotes
- `reasons` — "Why Work With Us" items
- `marketAreas` — Southeast Michigan areas
- `contact` — phone, email, brokerage, agent details

### Brand colors

The **Mulberry Noir** palette lives in `tailwind.config.ts` under `theme.extend.colors`:

| Token        | Hex       | Name           |
| ------------ | --------- | -------------- |
| `plum`       | `#1A1518` | Plum Charcoal  |
| `bruised`    | `#2A1F25` | Bruised Plum   |
| `truffle`    | `#25201F` | Truffle        |
| `smoked`     | `#3A2E32` | Smoked Mauve   |
| `pearl`      | `#F5E8E4` | Pearl Cream    |
| `dusty`      | `#A89AA0` | Dusty Mauve    |
| `wine`       | `#3D2530` | Wine Velvet    |
| `ivory`      | `#FAF6F1` | Ivory Linen    |
| `champagne`  | `#F4E9E4` | Champagne Blush|
| `stone`      | `#ECE0DC` | Stone Blush    |

### Property images

Placeholder photos load from Unsplash (configured in `next.config.mjs`). To use your own:

1. Drop images into `public/listings/`
2. Update the `image` paths in `lib/data.ts` (e.g. `/listings/home-1.jpg`)
3. The Unsplash entry in `next.config.mjs` can then be removed.

---

## Wiring up the contact form

`components/Contact.tsx` currently handles submit on the front end (shows a thank-you state). To connect it to a real destination, replace the `handleSubmit` function with a `fetch` to your API route, CRM, or email service (e.g. Resend, Formspree, a Next.js Route Handler).

---

## Notes

- Fully responsive (desktop / tablet / mobile).
- Respects `prefers-reduced-motion`.
- Sticky navbar with blur-on-scroll and animated mobile menu.
- Subtle film-grain overlay + Mulberry gradients for the high-end feel.

---

**SOLD IT TODAY** · Charlotte Hypes · REALTOR® & Team Lead · Remerica United Realty
Serving Southeast Michigan · 313-529-5750 · charlotte@soldittoday.com
