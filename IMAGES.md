# Replacing portfolio images

This is a quick guide for swapping in new photos yourself later, without touching any layout, CSS, or code.

## The rule

**Every image slot on the site is a fixed file path. To replace a photo, save your new file with the exact same filename (same name, same `.webp` extension) at the exact same path, overwriting the old one.**

That's it — no HTML/CSS edits needed. The site always crops each photo to fill its box (`object-fit: cover`), so any photo works in any slot; it doesn't need to be the exact pixel size, just similar in shape (portrait vs. landscape vs. square) to whatever it's replacing so the crop frames it well.

Your new file needs to be `.webp` format. If your photo is a `.jpg` or `.png`, convert it first — any free online "convert to WebP" tool works, or ask Claude to do it for you.

After replacing a file, commit and push the change (or ask Claude to) so the live site rebuilds with the new image.

## Homepage images (`assets/images/`)

These appear on the homepage binder (both the desktop landscape spread and the mobile portrait version use the same files).

| File | Where it appears | Shape |
|---|---|---|
| `hero-campaign.webp` | Featured campaign photo, next to the nav list | Portrait (~3:4) |
| `main-beauty.webp` | Large "Selected Work" image | Portrait (~4:5) |
| `product-visualization.webp` | "Product Visualization" thumbnail | Roughly square |
| `editorial-portrait.webp` | "Editorial Content" thumbnail | Landscape (~4:3) |
| `lower-portrait.webp` | "Vision" image | Landscape (~5:4) |
| `workspace.webp` | Image next to the body copy | Roughly square |
| `chair.webp` | Large image above the signature | Portrait (~5:6) |

## Project page galleries (`assets/images/gallery/`)

Each project page (Campaigns, Fashion, Products, Concepts) shows its images in the order below. All gallery images are portrait (Campaigns ~3:4, the other three ~4:5).

**Campaigns** (`campaigns.html`)
| File | Caption on site |
|---|---|
| `campaigns-1.webp` | Night Drive / Campaign |
| `campaigns-2.webp` | In Motion / Campaign |

**Fashion** (`fashion.html`)
| File | Caption on site |
|---|---|
| `fashion-1.webp` | first image |
| `fashion-2.webp` | second image |
| `fashion-3.webp` | third image |
| `fashion-4.webp` | fourth image |
| `fashion-5.webp` | fifth image |

**Products** (`products.html`)
| File | Caption on site |
|---|---|
| `products-1.webp` | Studio Bag / 01 |
| `products-2.webp` | Sneaker / Flat Lay |
| `products-3.webp` | Bowling Bag / Duo |
| `products-4.webp` | Silver Bag / Still Life |

**Concepts** (`concepts.html`)
| File | Caption on site |
|---|---|
| `concepts-1.webp` | Frozen / Digital Visual Study |
| `concepts-2.webp` | Claw Machine / Concept |
| `concepts-3.webp` | Hardware / Macro Study |

## Do not touch

`assets/binder/ring-band.webp` and `assets/binder/ring-spine.webp` are the photographed ring-hardware graphics used to build the binder itself (not portfolio photos) — leave these as they are.
