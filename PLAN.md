# omikuji-garden — Final Project Design Spec

**Date:** 2026-04-16
**Status:** Draft for user review
**Relationship to midterm:** Independent project. Inherits content from `architecture-garden` (9 articles) + 1 new article = 10 article library. Separate repo, separate aesthetic, separate folder.

---

## 1. Concept

A Japanese-aesthetic digital garden framed as a **御神籤 (omikuji)** shrine. Entering the site is a ritual: you draw a bamboo fortune stick. The stick reveals a **運勢 (fortune level)** and a short **籤文 (fortune poem)**. Flipping the stick over reveals today's recommended article from the garden's library.

The site has **two layers of randomness**, independent of each other:

1. **Fortune layer** — each draw randomly picks 1 of 14 fortune slips (7 levels × 2 entries each).
2. **Article layer** — each draw randomly picks 1 of 10 articles (weighted; new article gets a higher weight so first-time visitors are more likely to see it).

This means each visit is a ritual with two unrelated signals: *how is your luck today* and *what should you read today*.

---

## 2. Scope Boundaries (YAGNI)

**In scope:**
- Omikuji draw flow with touch interaction (tap-only, no shake/motion).
- 14 fortune slips, bilingual (日本語 + 中文譯註).
- 10 articles: 9 migrated from midterm + 1 new manifesto (see `drafts/architects-mission.md`).
- Japanese typographic aesthetic (tategaki for stick face + article titles; horizontal body for readability).
- Static site, zero build step, GitHub Pages deploy.
- Mobile-responsive (must work on phone — touch is the primary input).

**Out of scope:**
- Backend, database, user accounts.
- Device motion APIs (`devicemotion` requires permission prompts on iOS; touch only).
- Search, tagging, categories, archive views — the site IS the shrine; navigation is via re-draw.
- Multi-language switcher. Japanese + Chinese co-exist on the page by default.
- Comments, analytics, newsletter signup.
- Animations beyond the core stick-slide and flip (no parallax, no scroll triggers).

---

## 3. Technical Architecture

### Stack

| Layer | Choice | Reason |
|---|---|---|
| HTML/CSS/JS | Vanilla, ES modules | Matches midterm skill set; zero build step |
| Typography | Shippori Mincho + Noto Serif JP + EB Garamond | Google Fonts; Japanese-first with English fallback |
| Animation | CSS transitions + `requestAnimationFrame` for bamboo sway | No libraries |
| Data | Static JSON files (`data/articles.json`, `data/fortunes.json`) | Trivial to edit without rebuilding |
| Deploy | GitHub Pages via `.github/workflows/deploy.yml` | Copied from midterm |

### File structure

```
omikuji-garden/
├── index.html              # Entry — signbox + overlay shells
├── styles.css              # All styles (not inlined, unlike midterm)
├── app.js                  # Draw logic, overlay transitions, data loading
├── data/
│   ├── articles.json       # 10 articles (migrated + new)
│   └── fortunes.json       # 14 fortune slips
├── assets/
│   ├── bamboo.svg          # Signbox illustration (optional; fallback to CSS)
│   └── washi.png           # Paper texture (optional; fallback to CSS gradient)
├── drafts/
│   └── architects-mission.md  # Source of truth for new article (before JSON import)
├── .github/workflows/deploy.yml
├── README.md
└── PLAN.md                 # This file
```

### Why files are split (vs. midterm's monolithic index.html)

The midterm's `index.html` is 974 lines — fine for a one-pager but painful for data edits. Splitting styles, logic, and content into separate files makes it trivial to:
- Add a fortune slip (edit JSON, no HTML touch)
- Tune visual rhythm (edit CSS, no script touch)
- Port a midterm article (append to articles.json)

---

## 4. User Flow

```
┌─────────────────────────────────────────────────────────────┐
│  [Signbox page]                                             │
│  Static scene: a bamboo signbox (签筒) against washi-textured │
│  background. Ambient sway animation on background bamboo.   │
│                                                             │
│  Footer: "在此抽一签 / Tap the signbox to draw"              │
└─────────────────────────────────────────────────────────────┘
                         │
                    [tap signbox]
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  [Stick-drawing animation ~1.2s]                            │
│  A bamboo stick slides up and out of the signbox, stops    │
│  center-stage. Silent — no audio.                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  [Stick face — front]                                       │
│  • Red circular seal at top: the 運勢 kanji (大吉/吉/…)      │
│  • Tategaki column: Japanese 籤文 (1–2 lines)                │
│  • Small Chinese gloss below, horizontal                   │
│  • Bottom: stick number (e.g., 第七番)                       │
│                                                             │
│  Action: "翻开签背 / Flip the stick"                         │
│         "回签筒 / Return (re-draw)"                           │
└─────────────────────────────────────────────────────────────┘
                         │
                   [tap "翻开签背"]
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  [Article overlay]                                          │
│  • Title tategaki (vertical), centered at top               │
│  • Horizontal body, max-width 640px, washi background       │
│  • Side gutter with thin bamboo-node dividers marking       │
│    section breaks                                           │
│                                                             │
│  Footer actions:                                            │
│    "再抽一签 / Draw again"                                    │
│    "回签筒 / Return"                                          │
└─────────────────────────────────────────────────────────────┘
```

**No back button trap.** At any stage, a persistent small ⛩ icon in the top-left returns to the signbox and resets state.

---

## 5. Data Schemas

### `data/articles.json`

```json
{
  "articles": [
    {
      "id": "architects-mission",
      "slug": "architects-mission",
      "title": "不为废墟辩护",
      "titleEn": "No Apology for Ruins",
      "excerpt": "昨晚我有一个念头：毁灭吧——但这种念头不能出现在建筑师身上。",
      "body": "<markdown or sanitized HTML>",
      "weight": 3,
      "origin": "final-new",
      "sourceFile": "drafts/architects-mission.md"
    },
    {
      "id": "<midterm-entry-1>",
      "slug": "...",
      "title": "...",
      "body": "...",
      "weight": 1,
      "origin": "midterm-migrated"
    }
    /* ... 8 more midterm entries */
  ]
}
```

**Fields:**
- `weight` controls article-draw probability. New article = 3, others = 1 → new article is **25%** likely each draw (3 / (3 + 9×1) = 3/12). Tunable.
- `origin` is metadata only, not rendered.
- `body` is **a restricted markdown subset**: headings (`#`/`##`/`###`), paragraphs, bold (`**`), italic (`*`), blockquote (`>`), horizontal rule (`---`), emphasis line break. No images, no tables, no links, no code blocks. Rendered by a ~50-line hand-rolled parser in `app.js` — no library dependency.

### `data/fortunes.json`

```json
{
  "fortunes": [
    {
      "id": 1,
      "level": "大吉",
      "levelRomaji": "daikichi",
      "text_ja": "竹に風、心に道。迷はず歩むべし。",
      "text_zh": "竹中有风，心中有道。不必迟疑，直行即可。"
    }
    /* ... 13 more */
  ]
}
```

**Distribution (14 slips):**

| Level | Count | Romaji | Tone |
|---|---|---|---|
| 大吉 | 2 | daikichi | Very auspicious |
| 吉 | 2 | kichi | Auspicious |
| 中吉 | 2 | chūkichi | Moderately auspicious |
| 小吉 | 2 | shōkichi | Slightly auspicious |
| 末吉 | 2 | suekichi | Future-auspicious |
| 凶 | 2 | kyō | Inauspicious |
| 大凶 | 2 | daikyō | Very inauspicious |

Equal distribution (2 per level) keeps authoring load symmetric and the probability of each category transparent. Can be re-weighted to a more traditional curve later (typically traditional shrines skew toward neutral — 中吉/吉 are more common, 大凶 rare).

---

## 6. Visual Design

### Palette (CSS custom properties on `:root`)

```css
:root {
  --ink:        #1a1a1a;  /* 墨 — body text, outlines */
  --paper:      #f5f1e8;  /* 生成 — background, like aged washi */
  --vermilion:  #c1272d;  /* 朱 — fortune seal, 大吉/凶 accents */
  --moss:       #4a5a3a;  /* 苔 — bamboo, subtle dividers */
  --sumi-light: #5c5c5c;  /* 墨 (light) — secondary text, gloss */
}
```

### Typography

- **Heading / fortune level kanji** — Shippori Mincho 900, letter-spaced, large
- **Tategaki (signface + article title)** — Noto Serif JP, vertical via `writing-mode: vertical-rl`
- **Body (articles)** — EB Garamond for English, Noto Serif JP for Japanese, horizontal
- **Chinese gloss** — Noto Serif SC (Simplified Chinese serif), smaller, near-gray

### Key visual elements

- **Signbox** — SVG or canvas bamboo cylinder, ~200px × 300px, center of viewport. Slight idle animation: one stick pokes up and retracts every ~8s (hints at tappability).
- **Background** — washi paper texture at low opacity; in the distance, 2–3 vertical bamboo silhouettes that sway on a slow sine (period ~6s).
- **Stick** — long thin SVG rectangle with soft shadow. When drawn, it slides from signbox, rotates 5° to center frame.
- **Fortune seal** — red circle (`--vermilion`) with the level kanji white-on-red, positioned at stick top. Slight paper-stamped roughness using SVG `feTurbulence`.
- **Article overlay** — fills viewport, washi background with subtle vignette. Bamboo-node dividers in the left gutter mark each `<section>` break.

### Mobile

- Below 640px viewport: signbox scales to 60% viewport height, fortune stick fills center with horizontal padding, article overlay becomes full-bleed with 24px gutters.
- All interactions are tap; no hover-dependent UI.
- Safe areas respected (iOS notch).

---

## 7. Interaction Details (touch-only)

| Gesture | Location | Effect |
|---|---|---|
| Tap | Signbox | Trigger draw → stick slides out |
| Tap | Stick face | Flip stick → article preview revealed |
| Tap | "翻开签背" / stick back | Open article overlay |
| Tap | "再抽一签" | Reset to signbox, immediately draw |
| Tap | "回签筒" / ⛩ icon | Return to signbox (no auto-draw) |
| Tap | Article close | Close overlay, stick remains drawn |

No swipe, drag, long-press, pinch, or motion events. This keeps the interaction accessible and eliminates iOS permission prompts.

---

## 8. Article Migration (9 from midterm)

### Process

1. Open `architecture-garden/index.html`, locate the 9 `.entry-card` / overlay blocks.
2. For each: extract `title`, `excerpt`, and the overlay body HTML.
3. Sanitize: strip midterm-specific classes, convert to a flat `body` string (markdown-lite or minimal HTML).
4. Assign `id` / `slug` (kebab-case from the English title or a hand-chosen slug).
5. Append to `articles.json` with `weight: 1` and `origin: "midterm-migrated"`.

This is a one-time import. If the midterm is edited afterward, the JSON does **not** auto-sync — treat the JSON as canonical for the final site.

### Open question

Should we preserve midterm-specific visual quirks (glitch bars, Bebas Neue titles) when migrating? **Default: no.** The omikuji site has its own coherent Japanese aesthetic; midterm quirks would feel out of place. Only article *text* migrates, not styling.

---

## 9. Deployment

- Create new GitHub repo `omikuji-garden` under the same account (`BXya`).
- Copy `.github/workflows/deploy.yml` from midterm verbatim.
- Enable Pages → GitHub Actions in repo settings.
- Site lives at `https://bxya.github.io/omikuji-garden/`.

---

## 10. Content Deliverables — User Responsibility

| Item | Owner | Status |
|---|---|---|
| New manifesto article | User (draft by assistant) | **Drafted** in `drafts/architects-mission.md` — user to review |
| 14 fortune slips (日文 + 中译) | Assistant can draft, user approves | Pending |
| Migration of 9 midterm articles | Assistant (automated extraction) | Pending |
| Site coding (HTML/CSS/JS) | Assistant | Pending (post-approval) |
| Deploy + domain | User (manual GH repo create + settings toggle) | Pending |

---

## 11. Open Decisions (flagged for user review)

1. **Article weighting** — new article weight = 3 vs. 9 midterm articles weight = 1 each. Effective draw rate for new article = 25%. Acceptable?
2. **Fortune distribution** — 2-per-level (current) vs. traditional weighted (e.g., 大吉×2, 吉×3, 中吉×3, 小吉×2, 末吉×2, 凶×1, 大凶×1 = 14). Traditional is more authentic; equal is simpler. **Current choice: equal.**
3. **Sound** — should stick-draw have a subtle wooden knock sound? **Current choice: no sound.** (muted by default adds zero value)
4. **Local project folder name** — `omikuji-garden` (current) vs. Japanese `御神籤の庭` vs. Chinese `签庭`. **Current choice: `omikuji-garden`** (English slug for GitHub / deploy URL; Japanese name appears only in the UI as title).
5. **New article title** — current draft: **"不为废墟辩护 / No Apology for Ruins"**. Alternatives: "从废墟中组织生活", "建筑师的使命", "崩塌之后". User to confirm.

---

## 12. Risks

- **Typography fallback** — if Google Fonts fails to load (slow network, blocked in region), vertical Japanese text falls back to default serif and may render oddly. Mitigation: test with `font-display: swap` + local fallback stack prioritizing system Japanese fonts (Hiragino Mincho, Yu Mincho).
- **Tategaki on Safari** — `writing-mode: vertical-rl` is well-supported but punctuation positioning can be quirky. Test on iOS Safari before claiming "done".
- **Fortune authenticity** — if fortune poems are clumsy Japanese, feels amateur. Mitigation: draft in plain classical style, keep them short, optionally have a Japanese-literate reader review before deploy.
- **Draw-again fatigue** — if users draw 5 times hoping for 大吉 and never see it, site feels broken. With 2/14 weighting, 大吉 has ~14% per draw — visible within a few tries. Acceptable.

---

## 13. Next step (gated)

Once user approves this spec:
1. Invoke the `superpowers:writing-plans` skill to turn this design into a step-by-step implementation plan.
2. Execute the plan: scaffold folder, write HTML/CSS/JS, author fortunes, migrate articles, deploy.
3. Preview locally via `python -m http.server 8000`, then push to GitHub.
