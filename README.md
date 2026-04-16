# omikuji-garden

A Japanese-aesthetic digital garden framed as an 御神籤 (omikuji) shrine. Draw a bamboo fortune stick → reveal today's recommended article from the 10-article library.

## Relationship to `architecture-garden`

Separate project. Once Slice 6 lands, this site will inherit 9 articles from the midterm `architecture-garden` (tagged `origin: "midterm-migrated"` in `data/articles.json`) plus 1 new manifesto article.

## Design & plan

- Design spec: [`PLAN.md`](./PLAN.md)
- Implementation plan: [`docs/superpowers/plans/2026-04-16-omikuji-garden.md`](./docs/superpowers/plans/2026-04-16-omikuji-garden.md)

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

One-time setup:

1. Create the remote repo under your GitHub account:

   ```bash
   gh repo create omikuji-garden --public --source=. --push
   ```

2. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

3. Every subsequent push to `main` publishes via `.github/workflows/deploy.yml`.

Live URL (after first deploy): `https://<your-github-username>.github.io/omikuji-garden/`.

## Editing content

- **Add / edit a fortune:** `data/fortunes.json` — keep the total at 14 or update the plan's schema invariant.
- **Add / edit an article:** append to `data/articles.json`. For longer articles, draft in `drafts/` as markdown first and then inline the body into the JSON string.
- **Tweak colors:** CSS custom properties on `:root` in `styles.css` (palette: `--ink`, `--paper`, `--vermilion`, `--moss`, `--sumi-light`).
- **Adjust draw weighting:** each article's `weight` field in `data/articles.json`. Default `1`; the new manifesto uses `3`.

## Runtime dependencies

No npm packages, no build step. The page loads four font families from Google Fonts at runtime (Shippori Mincho, Noto Serif JP, Noto Serif SC, EB Garamond). If offline, the page falls back to system serifs (Hiragino Mincho / Yu Mincho / Songti / Georgia) per the CSS stack.
