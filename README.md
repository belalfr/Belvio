# Belvio

Static site: plain HTML, CSS and JavaScript. No framework, no build step.

## Preview locally
Paths are root-relative (`/assets/...`), like a real site, so double-clicking index.html shows it unstyled. Run a server:

    cd belvio-v2
    python3 -m http.server 8000

Open http://localhost:8000

## Before you publish: find and replace
1. `https://belvio.com` → your real domain (canonicals, Open Graph, sitemap.xml, robots.txt, JSON-LD)
2. `hello@belvio.com` → your real email (footer, contact page, privacy, terms, JSON-LD)
3. `FORM_ENDPOINT_URL` in `contact/index.html` → your Formspree (or similar) endpoint. Until then the form opens the visitor's email app.
4. Social links in the footer (LinkedIn, X, Instagram, GitHub) currently point to each site's homepage. Replace with your profiles.
5. Review `privacy/` and `terms/` (plain-English placeholders) before launch.
6. Hosting must serve the site from a domain root (GitHub Pages: a repo named `username.github.io`).

## Structure
    index.html, about/ work/ services/ process/ contact/ privacy/ terms/ blog/  (one folder per page)
    blog/posts/<slug>/index.html   404.html  robots.txt  sitemap.xml  site.webmanifest
    assets/css  base · layout · components · pages
    assets/js   motion · smooth · nav · reveal · buttons · grid · loader · spider · contact (+ vendor/lenis)
    assets/fonts  Archivo + JetBrains Mono (self-hosted)

## Adding a blog post
Copy `blog/posts/how-google-crawls-and-indexes/` to a new slug folder, edit title, description, canonical, dates and body, link it from `blog/index.html` and the home page, and add it to `sitemap.xml`.

## Motion
- Smooth scroll: Lenis (MIT), `assets/js/smooth.js` (`lerp`: lower = floatier).
- Unfold on scroll: add `data-reveal` to any element (`assets/js/reveal.js`).
- Page opener (home only): `assets/js/loader.js`. Shows on first visit of a session and on reload; `?loader=on` forces it.
- Spider CTA: `assets/js/spider.js` and the "spider" block in `assets/css/pages.css`.
- Buttons: bracket lock-on, label roll, crawler sweep, "200 OK Crawled" on click: "Buttons" block in `components.css`.
- Grid: `.bg-grid` (fades out down the page) and `.bg-glow` (brightens near the cursor) in `base.css`.
- Reduced motion: people with animations turned off get a calm version. Preview full motion with `?motion=on`, calm with `?motion=off`.

## Pre-launch checklist
Replace placeholders above, submit `sitemap.xml` in Google Search Console, test the form, check every page on a phone.
