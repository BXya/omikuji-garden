# omikuji-garden

A Japanese-aesthetic digital garden framed as an 御神籤 (omikuji) shrine. Draw a bamboo fortune stick → reveal today's recommended article from the 10-article library.

## Relationship to `architecture-garden`

Separate project. Inherits 9 articles from the midterm `architecture-garden` (see `data/articles.json`, `origin: "midterm-migrated"`) + 1 new manifesto article.

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
