# RONI / Grifel — Portfolio

A static portfolio site for an AI creative director / visual content designer. Pure HTML, CSS, and a few lines of vanilla JS — no build step, no framework, no dependencies.

## Structure

```
index.html          Homepage — fixed-canvas photographic binder reproduction (locked design, do not edit spacing/layout/type)
work.html            Portfolio overview (linked from "SEE MORE")
campaigns.html       Project type: Campaigns
fashion.html         Project type: Fashion
products.html        Project type: Products
concepts.html        Project type: Concepts
about.html           Bio
contact.html         Contact info
404.html             Not-found page

css/
  reset.css          Base reset
  variables.css      Color + font design tokens (shared everywhere)
  fonts.css          Self-hosted @font-face declarations
  typography.css     Shared type-role classes (masthead, captions, statement, etc.)
  layout.css         Homepage-only fixed-canvas layout
  binder.css         Homepage-only binder/paper/hardware overlay
  upper-page.css     Homepage-only upper page positioning
  lower-page.css     Homepage-only lower page positioning
  site.css           Subpage chrome — header, footer, galleries, section headers

js/
  scale.js           Scales the homepage's fixed canvas down on small viewports

assets/
  binder/hardware.png   Extracted acrylic/rail/ring overlay (from the reference photo)
  images/               Homepage image crops
  images/gallery/       Subpage gallery image crops
  fonts/                Self-hosted woff2 font files
  source/               Original uploaded photography (uncropped, kept for future re-cropping)

reference/design.png  Original reference photo the homepage was built from
```

## Running locally

No build step required. Serve the folder with any static file server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Design system

- **Colors / fonts**: defined once in `css/variables.css` and `css/fonts.css`, reused across every page.
- **Homepage** (`index.html`) is a fixed 1068×1472px canvas — a pixel-measured reproduction of the original reference photo. It scales down proportionally on small viewports but never reflows. Its content (text, nav, images) is live HTML; only the acrylic/rail/ring hardware is a baked-in photographic overlay.
- **Subpages** use a normal responsive flow (`css/site.css`) with the same color palette and type roles, so the whole site reads as one system.

## Content placeholders

- **`contact.html`** uses a placeholder email (`hello@roni-grifel.com`). Swap it for the real address whenever it's available — it's the only fabricated piece of content on the site.

## Swapping images

Every image sits in its own `<img>` tag at a fixed container size — replacing the file at the same path keeps the layout intact. Homepage containers are documented in the original build; gallery images live in `assets/images/gallery/` and follow a consistent 4:5 crop ratio (except the Campaigns spread, which uses 3:4).

## Deploying

This is a static site — no build step, no environment variables. It auto-deploys to **GitHub Pages** via `.github/workflows/deploy.yml` on every push to `main` (uses `actions/configure-pages`, which enables Pages on the repo automatically the first time the workflow runs). It can just as easily be dragged into Netlify or Vercel instead if preferred.
