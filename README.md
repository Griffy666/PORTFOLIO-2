# RONI / Grifel — Portfolio

A static portfolio site for an AI creative director / visual content designer. Pure HTML, CSS, and a few lines of vanilla JS — no build step, no framework, no dependencies.

## Structure

```
index.html          Homepage — open-binder spread (two pages side by side on desktop, stacked on phones/tablets)
work.html           Portfolio overview (linked from "SEE MORE")
campaigns.html      Project type: Campaigns
fashion.html        Project type: Fashion
products.html       Project type: Products
concepts.html       Project type: Concepts
about.html          Bio
contact.html        Contact info
404.html            Not-found page

css/
  reset.css           Base reset
  variables.css       Color + font design tokens (shared everywhere)
  fonts.css           Self-hosted @font-face declarations
  typography.css      Shared type-role classes (masthead, captions, statement, etc.)
  layout.css          Page base + cross-page fade
  home.css            Homepage building blocks (nav list, cards, grids)
  binder-desktop.css  Homepage binder spread: desktop layout (1024px+) and stacked layout below that
  site.css            Subpage chrome — header, footer, galleries, lightbox

js/
  lightbox.js         Click-to-enlarge viewer on the gallery pages

assets/
  binder/             Ring hardware images (vertical spine for desktop, horizontal band for phones)
  images/             Homepage image crops + og-image.jpg (link preview for WhatsApp/LinkedIn/etc.)
  images/gallery/     Subpage gallery image crops
  fonts/              Self-hosted woff2 font files
  source/             Original uploaded photography (kept in the repo, NOT published to the site)

reference/design.png  Original reference photo the homepage was built from (not published)
```

## Running locally

No build step required. Serve the folder with any static file server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Design system

- **Colors / fonts**: defined once in `css/variables.css` and `css/fonts.css`, reused across every page.
- **Homepage** (`index.html`) is an open binder: on desktop (1024px+) a left and right page with the ring spine on the seam; below that the same two pages stack vertically with the rings running horizontally between them, so text stays readable on phones.
- **Subpages** use a normal responsive flow (`css/site.css`) with the same color palette and type roles, so the whole site reads as one system.

## Content placeholders

- **`contact.html`** uses a placeholder email (`hello@roni-grifel.com`). Swap it for the real address whenever it's available — it's the only fabricated piece of content on the site.
- **Link previews** use absolute URLs on `roni-grifel-portfolio.dear-gnat-9578.chatgpt.site` (the `og:` / `canonical` tags in each page's `<head>`). If the site moves to a new domain, find-and-replace that domain.

## Swapping images

Every image sits in its own `<img>` tag at a fixed container size — replacing the file at the same path keeps the layout intact. Homepage containers are documented in the original build; gallery images live in `assets/images/gallery/` and follow a consistent 4:5 crop ratio (except the Campaigns spread, which uses 3:4).

## Deploying

This is a static site — no build step, no environment variables. The workflow copies only the files the site serves into `_site/` (leaving out `assets/source/`, `reference/` and the docs), then auto-deploys to **GitHub Pages** via `.github/workflows/deploy.yml` on every push to `main` (uses `actions/configure-pages`, which enables Pages on the repo automatically the first time the workflow runs). It can just as easily be dragged into Netlify or Vercel instead if preferred.
