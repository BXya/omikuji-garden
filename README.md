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

## Deploy

GitHub Pages via `.github/workflows/deploy.yml`. See `PLAN.md §9`.

## Runtime dependencies

No npm packages, no build step. The page loads four font families from Google Fonts at runtime (Shippori Mincho, Noto Serif JP, Noto Serif SC, EB Garamond). If offline, the page falls back to system serifs (Hiragino Mincho / Yu Mincho / Songti / Georgia) per the CSS stack.
