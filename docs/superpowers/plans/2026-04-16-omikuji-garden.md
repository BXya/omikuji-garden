# omikuji-garden Implementation Plan

> **For agentic workers:** Execute slice-by-slice. After each slice, dispatch a fresh `superpowers:code-reviewer` subagent for ruthless-mentor review. Only proceed to the next slice when review passes. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build a static Japanese-aesthetic "omikuji shrine" digital garden hosting 10 articles (9 migrated from midterm `architecture-garden` + 1 new manifesto), with a two-layer random fortune-stick entry ritual and touch-only interaction.

**Architecture:** Vanilla HTML/CSS/JS, zero dependencies, zero build. Data split into `articles.json` + `fortunes.json`. Tategaki (vertical Japanese text) for ritual surfaces, horizontal for article bodies. Deployed via GitHub Pages.

**Tech Stack:** HTML5 + CSS3 (custom properties, `writing-mode: vertical-rl`, CSS transitions) + ES modules in vanilla JS + Google Fonts (Shippori Mincho, Noto Serif JP, EB Garamond, Noto Serif SC).

**Reference spec:** `../../PLAN.md`

---

## Execution Protocol (ruthless-mentor gate between slices)

After each slice completes:

1. Run the slice's verification steps (local server + preview tools).
2. Dispatch `superpowers:code-reviewer` subagent with:
   - Path to this plan
   - The specific slice just completed
   - Files changed
   - Instruction: "Review ruthlessly. Check alignment to PLAN.md §N for this slice. Flag placeholders, hallucinated APIs, stylistic drift, missed spec items, dead code, unverified claims. Return verdict: PASS / FAIL-with-fix-list."
3. If FAIL: apply fix list, re-dispatch reviewer. Do not proceed.
4. If PASS: commit, proceed to next slice.

---

## Slice Map

| # | Slice | Spec Ref | Deliverable |
|---|---|---|---|
| 1 | Skeleton | PLAN §3 file structure | Project folder loads in browser, shows washi background |
| 2 | Data files | PLAN §5 schemas | `fortunes.json` (14 slips) + `articles.json` (1 article: manifesto) both parse, both fetchable from app.js |
| 3 | Signbox scene | PLAN §6 visual elements | Static scene with signbox + swaying bamboo bg renders |
| 4 | Draw + stick face | PLAN §4 flow (steps 1–3), §7 | Tap signbox → animated stick slides out → tategaki fortune face visible |
| 5 | Article overlay + markdown | PLAN §4 (step 4), §5 `body` subset | Tap flip → article overlay opens with rendered body |
| 6 | Midterm article migration | PLAN §8 | 9 additional articles appended; draw randomly selects from 10 |
| 7 | Responsive + font fallbacks | PLAN §6 mobile, §12 risk | Layout works at 375px, Japanese fonts have system fallbacks |
| 8 | Deploy | PLAN §9 | GitHub repo + Actions workflow ready; README has deploy instructions |

---

## Slice 1: Skeleton

**Spec alignment:** PLAN §3 (file structure), §6 (palette).

**Files:**
- Create: `omikuji-garden/index.html`
- Create: `omikuji-garden/styles.css`
- Create: `omikuji-garden/app.js`
- Create: `omikuji-garden/README.md`
- Create: `omikuji-garden/.gitignore`

- [ ] **Step 1.1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="ja-JP" data-lang-secondary="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>御神籤の庭 · omikuji-garden</title>
  <meta name="description" content="A digital garden framed as a Japanese omikuji shrine." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700;900&family=Noto+Serif+JP:wght@400;700&family=Noto+Serif+SC:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap"
    rel="stylesheet"
  />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main id="app">
    <h1 class="placeholder">御神籤の庭</h1>
    <p class="placeholder subtitle">omikuji-garden · under construction</p>
  </main>
  <script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 1.2: Create `styles.css`**

```css
:root {
  --ink:        #1a1a1a;
  --paper:      #f5f1e8;
  --vermilion:  #c1272d;
  --moss:       #4a5a3a;
  --sumi-light: #5c5c5c;

  --font-serif-ja: "Shippori Mincho", "Noto Serif JP",
                   "Hiragino Mincho ProN", "Yu Mincho", serif;
  --font-serif-zh: "Noto Serif SC", "Songti SC", "STSong", serif;
  --font-serif-en: "EB Garamond", Georgia, serif;

  --gutter: 24px;
  --max-body: 640px;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-serif-ja);
  -webkit-font-smoothing: antialiased;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  text-align: center;
  padding: var(--gutter);
}

.placeholder {
  font-family: var(--font-serif-ja);
  font-weight: 700;
  margin: 0;
}

h1.placeholder {
  font-size: clamp(2rem, 6vw, 4rem);
  letter-spacing: 0.1em;
}

.subtitle {
  font-family: var(--font-serif-en);
  color: var(--sumi-light);
  font-style: italic;
  margin-top: 0.5em;
}
```

- [ ] **Step 1.3: Create `app.js`**

```javascript
// omikuji-garden entry module.
// Real logic lands in later slices (signbox, draw, overlay).

function init() {
  // Smoke check: prove ES module boot works.
  console.log("[omikuji-garden] init ok");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

- [ ] **Step 1.4: Create `README.md`**

```markdown
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
```

- [ ] **Step 1.5: Create `.gitignore`**

```
.DS_Store
Thumbs.db
.claude/
.vscode/
node_modules/
```

- [ ] **Step 1.6: Verify locally**

Start server in the project folder, then use preview tools:

```bash
cd omikuji-garden && python -m http.server 8000
```

Expected: Browser at `http://localhost:8000` shows washi-colored background, "御神籤の庭" title centered, "omikuji-garden · under construction" subtitle below. Console shows `[omikuji-garden] init ok`.

- [ ] **Step 1.7: Commit**

```bash
cd omikuji-garden && git init && git add . && git commit -m "feat: scaffold project skeleton with palette and typography"
```

- [ ] **Step 1.8: Ruthless-mentor review gate**

Dispatch `superpowers:code-reviewer`. Review criteria:
- Does HTML load without console errors?
- Does CSS palette match PLAN §6 exactly?
- Does font stack include system fallbacks per PLAN §12?
- Are there any hallucinated file paths or broken links?
- Verdict: PASS / FAIL with fix list.

---

## Slice 2: Data files

**Spec alignment:** PLAN §5 (data schemas), new article from `drafts/architects-mission.md`.

**Files:**
- Create: `omikuji-garden/data/fortunes.json`
- Create: `omikuji-garden/data/articles.json`
- Modify: `omikuji-garden/app.js` — add data loader

- [ ] **Step 2.1: Create `data/fortunes.json` with 14 slips**

```json
{
  "fortunes": [
    { "id": 1,  "level": "大吉", "levelRomaji": "daikichi",  "text_ja": "竹に風、心に道。迷はず歩むべし。", "text_zh": "竹中有风，心中有道。不必迟疑，直行即可。" },
    { "id": 2,  "level": "大吉", "levelRomaji": "daikichi",  "text_ja": "朝日昇る丘、高き志の成就の兆し。", "text_zh": "朝阳升于高丘，壮志将成之兆。" },
    { "id": 3,  "level": "吉",   "levelRomaji": "kichi",     "text_ja": "静かに努むれば、実を結ぶ時節来る。", "text_zh": "安静耕耘，自有结果的时节。" },
    { "id": 4,  "level": "吉",   "levelRomaji": "kichi",     "text_ja": "石に苔、年月は味方なり。",         "text_zh": "石上生苔，岁月与你同在。" },
    { "id": 5,  "level": "中吉", "levelRomaji": "chukichi",  "text_ja": "半月は欠けつつも光を失はず。",     "text_zh": "月虽半缺，光华不失。" },
    { "id": 6,  "level": "中吉", "levelRomaji": "chukichi",  "text_ja": "急がず、されど止まらず。",         "text_zh": "不急不躁，亦不止步。" },
    { "id": 7,  "level": "小吉", "levelRomaji": "shokichi",  "text_ja": "小さな声も、届くべきところには届く。", "text_zh": "微小的声响，终会抵达该抵达之处。" },
    { "id": 8,  "level": "小吉", "levelRomaji": "shokichi",  "text_ja": "花一輪、季節を教ふ。",             "text_zh": "一朵小花，已足以述说季节。" },
    { "id": 9,  "level": "末吉", "levelRomaji": "suekichi",  "text_ja": "今はまだ芽、やがて幹となる。",     "text_zh": "此刻尚是新芽，终将成为树干。" },
    { "id": 10, "level": "末吉", "levelRomaji": "suekichi",  "text_ja": "冬の後に必ず春あり。",             "text_zh": "冬后必有春。" },
    { "id": 11, "level": "凶",   "levelRomaji": "kyo",       "text_ja": "道に迷ふ時、原点に帰るべし。",     "text_zh": "迷途之时，当归原点。" },
    { "id": 12, "level": "凶",   "levelRomaji": "kyo",       "text_ja": "強き風には頭を低くせよ。",         "text_zh": "狂风来时，俯首以避。" },
    { "id": 13, "level": "大凶", "levelRomaji": "daikyo",    "text_ja": "崩るる家、礎より建て直せ。",       "text_zh": "房屋既崩，从地基重建。" },
    { "id": 14, "level": "大凶", "levelRomaji": "daikyo",    "text_ja": "全てを失ひし時、真の創造始まる。", "text_zh": "一切失尽之时，真正的创造方始。" }
  ]
}
```

- [ ] **Step 2.2: Create `data/articles.json` with the new manifesto**

Read `drafts/architects-mission.md`, extract the body content (everything after the H1 and metadata italic line), escape for JSON string, then write:

```json
{
  "articles": [
    {
      "id": "architects-mission",
      "slug": "architects-mission",
      "title": "不为废墟辩护",
      "titleEn": "No Apology for Ruins",
      "excerpt": "昨晚我有一个念头：毁灭吧——但这种念头不能出现在建筑师身上。",
      "body": "<FULL MARKDOWN BODY OF drafts/architects-mission.md — sections I through VI — preserving the markdown subset per PLAN §5>",
      "weight": 3,
      "origin": "final-new",
      "sourceFile": "drafts/architects-mission.md"
    }
  ]
}
```

*Implementation note: the `body` field contains the literal markdown source (H2, H3, paragraphs, `>`, `**`, `*`, `---`). The executor must read the draft file and embed its markdown body verbatim — not a paraphrase. The H1 and italic metadata line at the top of the draft are consumed as `title` and (dropped), not included in `body`.*

- [ ] **Step 2.3: Add data loader to `app.js`**

Replace the contents of `app.js` with:

```javascript
// omikuji-garden entry module.

const DATA_PATHS = {
  fortunes: "data/fortunes.json",
  articles: "data/articles.json",
};

/** Load fortunes + articles in parallel. Returns { fortunes, articles }. */
async function loadData() {
  const [fortunesRes, articlesRes] = await Promise.all([
    fetch(DATA_PATHS.fortunes),
    fetch(DATA_PATHS.articles),
  ]);
  if (!fortunesRes.ok) throw new Error(`fortunes.json HTTP ${fortunesRes.status}`);
  if (!articlesRes.ok) throw new Error(`articles.json HTTP ${articlesRes.status}`);
  const fortunesDoc = await fortunesRes.json();
  const articlesDoc = await articlesRes.json();
  return { fortunes: fortunesDoc.fortunes, articles: articlesDoc.articles };
}

async function init() {
  try {
    const { fortunes, articles } = await loadData();
    console.log(`[omikuji-garden] loaded ${fortunes.length} fortunes, ${articles.length} articles`);
    window.__omikuji = { fortunes, articles }; // dev inspection handle
  } catch (err) {
    console.error("[omikuji-garden] data load failed:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

- [ ] **Step 2.4: Verify data loads**

Refresh browser. Console must show: `[omikuji-garden] loaded 14 fortunes, 1 articles`. Running `window.__omikuji.fortunes.length` in console returns `14`. Running `window.__omikuji.articles[0].id` returns `"architects-mission"`. Zero errors.

- [ ] **Step 2.5: Commit**

```bash
git add data/ app.js && git commit -m "feat: add fortunes + articles data with loader"
```

- [ ] **Step 2.6: Ruthless-mentor review gate**

Dispatch reviewer. Criteria:
- All 14 fortunes exactly 2 per level (大吉/吉/中吉/小吉/末吉/凶/大凶)?
- Each fortune has non-empty `text_ja` and `text_zh`?
- `articles[0].body` is the actual manifesto content from `drafts/architects-mission.md` — not a summary, not placeholder text, not "..."?
- `articles[0].weight === 3`?
- Loader handles HTTP errors per spec?
- Verdict: PASS / FAIL with fix list.

---

## Slice 3: Signbox scene + idle animation

**Spec alignment:** PLAN §6 key visual elements (signbox, background bamboo, washi).

**Files:**
- Modify: `omikuji-garden/index.html` — replace placeholder with signbox scene
- Modify: `omikuji-garden/styles.css` — scene styles + sway animation

- [ ] **Step 3.1: Replace `<main id="app">` in `index.html`**

```html
<main id="app" data-stage="signbox">
  <div class="scene" aria-label="omikuji shrine scene">
    <div class="bamboo-bg" aria-hidden="true">
      <svg class="bamboo-stalk bamboo-stalk--1" viewBox="0 0 80 600" preserveAspectRatio="none">
        <rect x="30" y="0" width="20" height="600" fill="var(--moss)" opacity="0.18" />
        <line x1="40" y1="120" x2="40" y2="120" stroke="var(--moss)" stroke-width="22" stroke-linecap="round" opacity="0.22" />
        <line x1="40" y1="260" x2="40" y2="260" stroke="var(--moss)" stroke-width="22" stroke-linecap="round" opacity="0.22" />
        <line x1="40" y1="420" x2="40" y2="420" stroke="var(--moss)" stroke-width="22" stroke-linecap="round" opacity="0.22" />
      </svg>
      <svg class="bamboo-stalk bamboo-stalk--2" viewBox="0 0 80 600" preserveAspectRatio="none">
        <rect x="30" y="0" width="20" height="600" fill="var(--moss)" opacity="0.12" />
        <line x1="40" y1="180" x2="40" y2="180" stroke="var(--moss)" stroke-width="22" stroke-linecap="round" opacity="0.16" />
        <line x1="40" y1="360" x2="40" y2="360" stroke="var(--moss)" stroke-width="22" stroke-linecap="round" opacity="0.16" />
      </svg>
      <svg class="bamboo-stalk bamboo-stalk--3" viewBox="0 0 80 600" preserveAspectRatio="none">
        <rect x="30" y="0" width="20" height="600" fill="var(--moss)" opacity="0.10" />
        <line x1="40" y1="220" x2="40" y2="220" stroke="var(--moss)" stroke-width="22" stroke-linecap="round" opacity="0.14" />
      </svg>
    </div>

    <button type="button" class="signbox" id="signbox" aria-label="签筒 — tap to draw a fortune stick">
      <svg viewBox="0 0 200 300" class="signbox-svg" aria-hidden="true">
        <!-- cylinder body -->
        <ellipse cx="100" cy="40"  rx="70" ry="18" fill="var(--moss)" opacity="0.9" />
        <rect    x="30"  y="40"    width="140" height="240" fill="var(--moss)" opacity="0.85" />
        <ellipse cx="100" cy="280" rx="70" ry="18" fill="#2e3a22" opacity="1" />
        <!-- bamboo nodes on cylinder -->
        <line x1="30" y1="100" x2="170" y2="100" stroke="#2e3a22" stroke-width="3" opacity="0.6" />
        <line x1="30" y1="180" x2="170" y2="180" stroke="#2e3a22" stroke-width="3" opacity="0.6" />
        <!-- peeking stick (idle hint) -->
        <rect class="peek-stick" x="92" y="-20" width="16" height="80" fill="#e8d9a8" stroke="#a8896a" stroke-width="1.2" rx="2" />
      </svg>
    </button>

    <p class="signbox-label">在此抽一签 · Tap the signbox to draw</p>
  </div>
</main>
```

- [ ] **Step 3.2: Add scene styles to `styles.css`** (append to end)

```css
/* ===== Signbox scene ===== */

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.scene {
  position: relative;
  width: min(100%, 960px);
  height: 100vh;
  max-height: 880px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.bamboo-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.bamboo-stalk {
  position: absolute;
  top: -5%;
  height: 110%;
  width: 80px;
  transform-origin: 50% 0%;
  animation: sway 6s ease-in-out infinite;
}

.bamboo-stalk--1 { left: 10%; animation-delay: 0s; }
.bamboo-stalk--2 { left: 72%; animation-delay: -2s; animation-duration: 7s; }
.bamboo-stalk--3 { left: 88%; animation-delay: -4s; animation-duration: 8s; }

@keyframes sway {
  0%, 100% { transform: rotate(-1.2deg); }
  50%      { transform: rotate( 1.2deg); }
}

.signbox {
  position: relative;
  z-index: 2;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  width: clamp(160px, 30vw, 220px);
  aspect-ratio: 200 / 300;
  transition: transform 160ms ease-out;
  -webkit-tap-highlight-color: transparent;
}

.signbox:active { transform: scale(0.97); }

.signbox-svg {
  width: 100%;
  height: 100%;
  display: block;
  filter: drop-shadow(0 8px 18px rgba(26, 26, 26, 0.18));
}

.peek-stick {
  animation: peek 8s ease-in-out infinite;
  transform-origin: 50% 100%;
}

@keyframes peek {
  0%, 12%, 30%, 100% { transform: translateY(0); }
  18%, 22%           { transform: translateY(-18px); }
}

.signbox-label {
  position: relative;
  z-index: 2;
  font-family: var(--font-serif-ja);
  font-size: 0.95rem;
  color: var(--sumi-light);
  letter-spacing: 0.08em;
  margin: 0;
}

/* Hide old placeholders */
.placeholder { display: none; }
```

- [ ] **Step 3.3: Verify visually**

Start server, open page. Use preview tools:
1. `preview_snapshot` — confirm scene has signbox (button role, accessible name "签筒 — tap to draw a fortune stick") + label.
2. `preview_screenshot` — confirm bamboo silhouettes at left/right/edge, signbox centered, washi background.
3. Observe for 10 seconds — confirm stalks sway gently and the peek stick pokes up ~every 8s.

- [ ] **Step 3.4: Commit**

```bash
git add index.html styles.css && git commit -m "feat: add signbox scene with swaying bamboo background"
```

- [ ] **Step 3.5: Ruthless-mentor review gate**

Reviewer criteria:
- SVG renders without errors on Safari/Chrome/Firefox (check `preview_console_logs`)?
- Signbox is a native `<button>` (accessible, keyboard-focusable) — not a generic `<div>`?
- Background bamboo is `aria-hidden` (decorative, not announced)?
- Sway / peek animations are CSS-only, respect `prefers-reduced-motion` (**flag if not — add media query**)?
- Verdict: PASS / FAIL.

*If the reviewer flags missing `prefers-reduced-motion`: add this to styles.css:*

```css
@media (prefers-reduced-motion: reduce) {
  .bamboo-stalk, .peek-stick { animation: none; }
}
```

---

## Slice 4: Draw + stick face

**Spec alignment:** PLAN §4 (flow steps 1–3), §7 (touch interaction table).

**Files:**
- Modify: `omikuji-garden/index.html` — add drawn-stick + fortune-face markup
- Modify: `omikuji-garden/styles.css` — stick + tategaki + vermilion seal styles
- Modify: `omikuji-garden/app.js` — draw handler, random pick, stage transitions

- [ ] **Step 4.1: Append to `index.html` inside `.scene`, after `.signbox-label`**

```html
    <!-- Drawn-stick stage (hidden until draw) -->
    <section class="stick-stage" id="stick-stage" hidden>
      <div class="stick" id="stick" data-face="front">
        <!-- Front face: fortune -->
        <div class="stick-face stick-face--front">
          <div class="fortune-seal" id="fortune-seal" aria-label="運勢">大吉</div>
          <div class="fortune-text" id="fortune-text-ja" lang="ja"></div>
          <div class="fortune-gloss" id="fortune-text-zh" lang="zh-CN"></div>
          <div class="stick-number" id="stick-number">第〇番</div>
        </div>
        <!-- Back face populated in Slice 5 -->
        <div class="stick-face stick-face--back" aria-hidden="true"></div>
      </div>

      <div class="stick-actions">
        <button type="button" class="btn btn--primary" id="btn-flip">翻开签背 · Flip</button>
        <button type="button" class="btn btn--ghost"   id="btn-redraw">回签筒 · Return</button>
      </div>
    </section>
```

- [ ] **Step 4.2: Append stick + button styles to `styles.css`**

```css
/* ===== Drawn-stick stage ===== */

.stick-stage {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.stick {
  position: relative;
  width: clamp(80px, 14vw, 120px);
  height: clamp(380px, 56vh, 520px);
  perspective: 1200px;
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.stick-face {
  position: absolute;
  inset: 0;
  background: #e8d9a8;
  border: 1px solid #a8896a;
  border-radius: 6px;
  box-shadow: 0 10px 24px rgba(26, 26, 26, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem 0.4rem;
  backface-visibility: hidden;
}

.stick-face--front {
  gap: 0.9rem;
}

.stick-face--back {
  transform: rotateY(180deg);
  background: #dcc992;
}

.fortune-seal {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--vermilion);
  color: #faf3e2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif-ja);
  font-weight: 900;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.35);
  transform: rotate(-4deg);
}

.fortune-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: var(--font-serif-ja);
  font-size: 1rem;
  line-height: 1.8;
  letter-spacing: 0.14em;
  color: var(--ink);
  max-height: 60%;
  text-align: start;
}

.fortune-gloss {
  font-family: var(--font-serif-zh);
  font-size: 0.72rem;
  line-height: 1.5;
  color: var(--sumi-light);
  writing-mode: horizontal-tb;
  padding: 0 0.5rem;
  margin-top: auto;
  text-align: center;
  max-width: 100%;
}

.stick-number {
  font-family: var(--font-serif-ja);
  font-size: 0.7rem;
  color: var(--sumi-light);
  letter-spacing: 0.1em;
}

/* Stick entrance animation: slides from below viewport */
.stick-stage[data-anim="entering"] .stick {
  animation: stick-slide-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes stick-slide-up {
  0%   { opacity: 0; transform: translateY(60vh) rotate(-14deg); }
  60%  { opacity: 1; transform: translateY(-8px) rotate(3deg); }
  100% { opacity: 1; transform: translateY(0)    rotate(0deg); }
}

.stick-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  font-family: var(--font-serif-ja);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  padding: 0.75rem 1.4rem;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid var(--ink);
  transition: background 160ms ease, color 160ms ease;
  -webkit-tap-highlight-color: transparent;
}

.btn--primary {
  background: var(--ink);
  color: var(--paper);
}
.btn--primary:active { background: #3a3a3a; }

.btn--ghost {
  background: transparent;
  color: var(--ink);
}
.btn--ghost:active { background: rgba(26,26,26,0.06); }

/* Stage transitions: hide signbox when stick is drawn */
#app[data-stage="stick"] .signbox,
#app[data-stage="stick"] .signbox-label {
  display: none;
}
#app[data-stage="signbox"] .stick-stage {
  display: none;
}
```

- [ ] **Step 4.3: Replace `app.js` with full draw logic**

```javascript
// omikuji-garden — draw + stick-face logic.
// Article overlay lands in Slice 5.

const DATA_PATHS = {
  fortunes: "data/fortunes.json",
  articles: "data/articles.json",
};

const state = {
  fortunes: [],
  articles: [],
  currentFortune: null,
  currentArticle: null,
};

async function loadData() {
  const [fr, ar] = await Promise.all([
    fetch(DATA_PATHS.fortunes),
    fetch(DATA_PATHS.articles),
  ]);
  if (!fr.ok) throw new Error(`fortunes.json HTTP ${fr.status}`);
  if (!ar.ok) throw new Error(`articles.json HTTP ${ar.status}`);
  const fd = await fr.json();
  const ad = await ar.json();
  return { fortunes: fd.fortunes, articles: ad.articles };
}

/** Unbiased random pick of one fortune. */
function pickFortune(fortunes) {
  const i = Math.floor(Math.random() * fortunes.length);
  return fortunes[i];
}

/** Weighted random pick of one article. Article weights default to 1. */
function pickArticle(articles) {
  const total = articles.reduce((s, a) => s + (a.weight ?? 1), 0);
  let r = Math.random() * total;
  for (const a of articles) {
    r -= (a.weight ?? 1);
    if (r <= 0) return a;
  }
  return articles[articles.length - 1];
}

function setStage(stage) {
  document.getElementById("app").dataset.stage = stage;
}

function renderStickFront(fortune) {
  document.getElementById("fortune-seal").textContent = fortune.level;
  document.getElementById("fortune-text-ja").textContent = fortune.text_ja;
  document.getElementById("fortune-text-zh").textContent = fortune.text_zh;
  document.getElementById("stick-number").textContent = `第 ${fortune.id} 番`;
}

function draw() {
  state.currentFortune = pickFortune(state.fortunes);
  state.currentArticle = pickArticle(state.articles);
  renderStickFront(state.currentFortune);

  const stage = document.getElementById("stick-stage");
  stage.hidden = false;
  stage.dataset.anim = "entering";
  setStage("stick");

  // Clear animation class after it plays so re-draws retrigger it.
  stage.addEventListener("animationend", () => {
    delete stage.dataset.anim;
  }, { once: true });
}

function returnToSignbox() {
  const stage = document.getElementById("stick-stage");
  stage.hidden = true;
  setStage("signbox");
  state.currentFortune = null;
  state.currentArticle = null;
}

function wireEvents() {
  document.getElementById("signbox").addEventListener("click", draw);
  document.getElementById("btn-redraw").addEventListener("click", () => {
    returnToSignbox();
    draw();
  });
  // btn-flip wired in Slice 5
}

async function init() {
  try {
    const { fortunes, articles } = await loadData();
    state.fortunes = fortunes;
    state.articles = articles;
    wireEvents();
    setStage("signbox");
    console.log(`[omikuji-garden] ready — ${fortunes.length} fortunes, ${articles.length} articles`);
    window.__omikuji = state; // dev handle
  } catch (err) {
    console.error("[omikuji-garden] init failed:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

- [ ] **Step 4.4: Verify draw flow**

1. `preview_click` on the signbox.
2. `preview_snapshot` — confirm `#stick-stage` is visible, `.fortune-seal` contains a kanji from `{大吉, 吉, 中吉, 小吉, 末吉, 凶, 大凶}`, `.fortune-text` contains Japanese text, `.fortune-gloss` contains Chinese text.
3. `preview_click` on `回签筒 · Return` — scene returns to signbox, and immediately re-draws (confirm different fortune or accept same by chance).
4. `preview_console_logs` — no errors.

- [ ] **Step 4.5: Commit**

```bash
git add . && git commit -m "feat: implement draw mechanic with animated stick slide and fortune face"
```

- [ ] **Step 4.6: Ruthless-mentor review gate**

Reviewer criteria:
- `pickFortune` uniform random; `pickArticle` honors `weight` field?
- Two-layer independence preserved (fortune and article chosen separately)?
- Draw triggers animation restart on re-draw (the `animationend` cleanup actually works)?
- No dead references to elements that don't exist yet (flip button wiring should be empty here)?
- Re-draws use new random values each time (confirm by clicking 5× in a row, observing variance)?
- Verdict: PASS / FAIL.

---

## Slice 5: Article overlay + markdown renderer

**Spec alignment:** PLAN §4 (flow step 4), §5 body subset, §6 article overlay.

**Files:**
- Modify: `omikuji-garden/index.html` — add overlay markup
- Modify: `omikuji-garden/styles.css` — overlay + article body + tategaki title
- Modify: `omikuji-garden/app.js` — markdown parser + flip/overlay handlers

- [ ] **Step 5.1: Append overlay markup to `index.html` inside `<main id="app">`, after `</section>` of stick-stage**

```html
    <!-- Article overlay (hidden by default) -->
    <div class="overlay" id="overlay" role="dialog" aria-modal="true" aria-labelledby="overlay-title" hidden>
      <article class="article">
        <header class="article-header">
          <h1 class="article-title" id="overlay-title" lang="zh-CN"></h1>
          <p class="article-title-en" id="overlay-title-en" lang="en"></p>
        </header>
        <div class="article-body" id="overlay-body"></div>
        <footer class="article-actions">
          <button type="button" class="btn btn--primary" id="btn-redraw-from-article">再抽一签 · Draw again</button>
          <button type="button" class="btn btn--ghost"   id="btn-close-article">回签筒 · Return</button>
        </footer>
      </article>
    </div>
```

- [ ] **Step 5.2: Append overlay + article styles to `styles.css`**

```css
/* ===== Article overlay ===== */

.overlay {
  position: fixed;
  inset: 0;
  background: var(--paper);
  overflow-y: auto;
  padding: clamp(1.5rem, 5vw, 3rem) var(--gutter);
  z-index: 10;
  animation: overlay-in 320ms ease-out;
}

@keyframes overlay-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.article {
  max-width: var(--max-body);
  margin: 0 auto;
  font-family: var(--font-serif-en);
}

.article-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.article-title {
  writing-mode: vertical-rl;
  font-family: var(--font-serif-ja);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--ink);
  line-height: 1.4;
  margin: 0 auto 1rem;
  max-height: 280px;
  display: inline-block;
}

.article-title-en {
  font-family: var(--font-serif-en);
  font-style: italic;
  font-size: 1rem;
  color: var(--sumi-light);
  margin: 0;
  letter-spacing: 0.04em;
}

.article-body {
  font-family: var(--font-serif-zh);
  font-size: 1.02rem;
  line-height: 1.9;
  color: var(--ink);
}

.article-body h2 {
  font-family: var(--font-serif-ja);
  font-size: 1.35rem;
  margin: 2.5rem 0 1rem;
  padding-left: 0.8rem;
  border-left: 3px solid var(--moss);
  letter-spacing: 0.06em;
}

.article-body h3 {
  font-family: var(--font-serif-ja);
  font-size: 1.1rem;
  margin: 1.8rem 0 0.6rem;
  color: var(--sumi-light);
}

.article-body p { margin: 0 0 1.1em; }

.article-body blockquote {
  margin: 1.5em 0;
  padding: 0.6em 1.1em;
  border-left: 3px solid var(--vermilion);
  background: rgba(193, 39, 45, 0.05);
  font-style: italic;
  color: var(--ink);
}

.article-body hr {
  border: none;
  height: 1px;
  background: var(--moss);
  opacity: 0.3;
  margin: 2.5em 0;
}

.article-body strong { font-weight: 700; color: var(--ink); }
.article-body em     { font-style: italic; }

.article-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(26,26,26,0.08);
}
```

- [ ] **Step 5.3: Extend `app.js` — add markdown renderer and overlay handlers**

Add at top of file (after `LEVEL_TO_KANJI`):

```javascript
/**
 * Minimal markdown renderer — intentionally limited per PLAN §5.
 * Supports: ##, ###, paragraphs, **bold**, *italic*, > blockquote, ---, blank-line breaks.
 * Escapes HTML first to prevent injection.
 */
function renderMarkdown(src) {
  const escape = (s) => s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const inline = (s) => s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  const lines = escape(src).split(/\r?\n/);
  const out = [];
  let para = [];
  let quote = [];

  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(" ").trim())}</p>`); para = []; }
  };
  const flushQuote = () => {
    if (quote.length) {
      out.push(`<blockquote>${quote.map(l => inline(l)).join("<br/>")}</blockquote>`);
      quote = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flushPara(); flushQuote(); continue; }
    if (line.startsWith("### ")) { flushPara(); flushQuote(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("## "))  { flushPara(); flushQuote(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("# "))   { flushPara(); flushQuote(); continue; } // H1 owned by title, skip in body
    if (line === "---")          { flushPara(); flushQuote(); out.push("<hr/>"); continue; }
    if (line.startsWith("> "))   { flushPara(); quote.push(line.slice(2)); continue; }
    flushQuote();
    para.push(line);
  }
  flushPara();
  flushQuote();
  return out.join("\n");
}
```

Add overlay functions (before `wireEvents`):

```javascript
function openArticle(article) {
  document.getElementById("overlay-title").textContent = article.title;
  document.getElementById("overlay-title-en").textContent = article.titleEn ?? "";
  document.getElementById("overlay-body").innerHTML = renderMarkdown(article.body ?? "");
  const overlay = document.getElementById("overlay");
  overlay.hidden = false;
  overlay.scrollTop = 0;
}

function closeArticle() {
  document.getElementById("overlay").hidden = true;
}
```

Extend `wireEvents()`:

```javascript
function wireEvents() {
  document.getElementById("signbox").addEventListener("click", draw);
  document.getElementById("btn-redraw").addEventListener("click", () => {
    returnToSignbox();
    draw();
  });
  document.getElementById("btn-flip").addEventListener("click", () => {
    if (state.currentArticle) openArticle(state.currentArticle);
  });
  document.getElementById("btn-close-article").addEventListener("click", () => {
    closeArticle();
  });
  document.getElementById("btn-redraw-from-article").addEventListener("click", () => {
    closeArticle();
    returnToSignbox();
    draw();
  });
}
```

- [ ] **Step 5.4: Verify article flow**

1. Draw → flip → overlay opens.
2. `preview_snapshot` — confirm `.article-title` contains "不为废墟辩护", `.article-body` contains rendered H2 sections ("I.", "II. 软版本 vs. 硬版本", etc.), `<blockquote>` elements present, horizontal rule `<hr>` present.
3. `preview_inspect` on `.article-title` — confirm `writing-mode: vertical-rl`.
4. Scroll overlay — verify scroll works.
5. Click "再抽一签" — overlay closes, new draw starts.
6. Click "回签筒" from overlay — overlay closes, returns to signbox.
7. `preview_console_logs` — no errors.

- [ ] **Step 5.5: Commit**

```bash
git add . && git commit -m "feat: add article overlay with minimal markdown renderer"
```

- [ ] **Step 5.6: Ruthless-mentor review gate**

Reviewer criteria:
- Markdown renderer escapes HTML *before* applying inline rules (XSS defence)?
- Unsupported markdown (links, images, tables, code blocks) is not silently eaten into garbage HTML? (Test by feeding `[link](url)` — should become literal text, not broken HTML.)
- `openArticle` uses `.innerHTML` only on rendered (escaped) output — never raw article body?
- Tategaki title actually renders vertically (inspect CSS)?
- All three "return" paths work (flip→article→return, flip→article→redraw, direct return from stick)?
- Verdict: PASS / FAIL.

---

## Slice 6: Midterm article migration

**Spec alignment:** PLAN §8 (migration process).

**Files:**
- Read: `C:\Users\26781\Downloads\architecture-garden\index.html` (source)
- Modify: `omikuji-garden/data/articles.json` — append 9 migrated articles

- [ ] **Step 6.1: Extract midterm articles**

Read `architecture-garden/index.html`. Find every `.entry-card` element (expected: 9 per PLAN §2 and README). For each card:
- `id` / `slug`: kebab-case derived from the English title, or the anchor href the card points to
- `title`: the card's visible title text (preserve original language)
- `titleEn`: the English subtitle if present, else `null`
- `excerpt`: card's visible description text
- `body`: the overlay panel's full text content that the card opens (convert paragraphs to the markdown subset — `\n\n` between paragraphs, preserve blockquotes as `> `, preserve emphasis)
- `weight`: `1`
- `origin`: `"midterm-migrated"`
- `sourceFile`: `"architecture-garden/index.html#<anchor>"`

**Do not invent content.** If a field isn't present in source, set it to `null` (for `titleEn`) or empty string (for `excerpt`). If fewer than 9 entry cards are found, STOP and flag — the reviewer should verify the actual count.

- [ ] **Step 6.2: Append migrated articles to `data/articles.json`**

The resulting file should have exactly 10 articles total: `architects-mission` first (weight 3) + the 9 migrated (weight 1 each).

- [ ] **Step 6.3: Verify full-library draw**

1. Reload browser. Console must show: `[omikuji-garden] ready — 14 fortunes, 10 articles`.
2. Click signbox 10 times, record which articles appear. Expect visible variance: at least 3 distinct article IDs in 10 draws. If only 1 article ever shows, the weighted picker is broken — investigate.
3. Flip to each of those articles — overlay renders each body correctly (no broken markdown, no empty sections).

- [ ] **Step 6.4: Commit**

```bash
git add data/articles.json && git commit -m "feat: migrate 9 articles from midterm architecture-garden"
```

- [ ] **Step 6.5: Ruthless-mentor review gate**

Reviewer criteria:
- Exactly 10 articles in `articles.json`?
- Every migrated `body` contains the ACTUAL midterm content (not a paraphrase, not a placeholder, not a lorem-ipsum)?
- Every article has non-empty `title` and non-empty `body`?
- `weight` values: `architects-mission === 3`, all others `=== 1`?
- `origin`: 1× `"final-new"`, 9× `"midterm-migrated"`?
- No midterm-specific HTML classes (`.glitch-bar`, Bebas Neue styling) leaked into `body` per PLAN §8 ("only article text migrates, not styling")?
- Verdict: PASS / FAIL.

---

## Slice 7: Responsive + font fallbacks

**Spec alignment:** PLAN §6 (mobile), §12 (typography fallback risk).

**Files:**
- Modify: `omikuji-garden/styles.css` — mobile media queries, `prefers-reduced-motion`
- Modify: `omikuji-garden/index.html` — add `<meta>` and preload optimizations if missing

- [ ] **Step 7.1: Append mobile media query to `styles.css`**

```css
/* ===== Mobile (<= 640px) ===== */

@media (max-width: 640px) {
  .scene {
    height: 100vh;
    gap: 1rem;
    padding: 1rem;
  }

  .signbox {
    width: 55vw;
    max-width: 200px;
  }

  .bamboo-stalk--1 { left: 2%;  width: 50px; }
  .bamboo-stalk--2 { left: 84%; width: 50px; }
  .bamboo-stalk--3 { display: none; }

  .stick {
    width: 22vw;
    max-width: 110px;
    height: 65vh;
    max-height: 480px;
  }

  .fortune-seal { width: 48px; height: 48px; font-size: 0.95rem; }
  .fortune-text { font-size: 0.9rem; }
  .fortune-gloss { font-size: 0.66rem; }

  .overlay {
    padding: 1.5rem 1rem calc(1.5rem + env(safe-area-inset-bottom)) 1rem;
  }

  .article-body { font-size: 0.98rem; line-height: 1.8; }
  .article-title { max-height: 220px; font-size: 1.6rem; }

  .stick-actions, .article-actions { flex-direction: column; width: 100%; }
  .btn { width: 100%; }
}
```

- [ ] **Step 7.2: Append `prefers-reduced-motion` to `styles.css`**

```css
/* ===== Accessibility: respect reduced-motion preference ===== */
@media (prefers-reduced-motion: reduce) {
  .bamboo-stalk,
  .peek-stick {
    animation: none;
  }
  .stick-stage[data-anim="entering"] .stick {
    animation: none;
  }
  .overlay { animation: none; }
}
```

- [ ] **Step 7.3: Verify mobile + accessibility**

1. `preview_resize` to 375×812 (iPhone 13 mini).
2. `preview_screenshot` — confirm: signbox fits, no horizontal scroll, label readable, third bamboo stalk hidden.
3. Tap signbox. Verify stick renders inside viewport, actions stack vertically, full-width.
4. Open article. Confirm body is readable (no overflow, safe-area respected at bottom).
5. `preview_resize` back to 1280×800.
6. Run in console: `matchMedia('(prefers-reduced-motion: reduce)').matches` — if testable, toggle it at OS level and verify animations stop.
7. `preview_console_logs` — still clean.

- [ ] **Step 7.4: Commit**

```bash
git add styles.css && git commit -m "feat: add mobile layout and prefers-reduced-motion support"
```

- [ ] **Step 7.5: Ruthless-mentor review gate**

Reviewer criteria:
- No horizontal scroll at 320px, 375px, 414px, 768px widths (test with `preview_resize`)?
- Font stack fallbacks (Hiragino / Yu Mincho / Songti / Georgia) work when Google Fonts is blocked — test by adding network throttle or editing `<link>` to a bad URL temporarily, confirm readable fallback?
- `prefers-reduced-motion` actually disables all three motion sources (background sway, peek stick, stick slide-up)?
- No jank when article overlay opens on mobile (animation smooth, no layout shift)?
- Verdict: PASS / FAIL.

---

## Slice 8: Deploy

**Spec alignment:** PLAN §9 (deployment).

**Files:**
- Create: `omikuji-garden/.github/workflows/deploy.yml`
- Modify: `omikuji-garden/README.md` — concrete deploy steps

- [ ] **Step 8.1: Read midterm deploy workflow for reference**

Read `architecture-garden/.github/workflows/deploy.yml`. Copy verbatim if it's generic Pages deploy. If it has midterm-specific paths, adapt paths to `omikuji-garden`.

- [ ] **Step 8.2: Create `.github/workflows/deploy.yml`**

If midterm's workflow is available, copy it. Otherwise use this canonical GitHub Pages static-site workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 8.3: Update `README.md` with deploy instructions**

Replace the placeholder `## Deploy` section with:

```markdown
## Deploy to GitHub Pages

One-time setup:

1. Create the remote repo under your account:
   ```bash
   gh repo create omikuji-garden --public --source=. --push
   ```
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` publishes the site.

Live URL (after first deploy): `https://<your-github-username>.github.io/omikuji-garden/`.

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Editing

- **Add / edit a fortune:** `data/fortunes.json` (must keep total at 14 or update slice 2 schema invariant).
- **Add / edit an article:** `data/articles.json`. Draft long articles in `drafts/` as markdown first, then inline the body into the JSON string.
- **Tweak colors:** CSS custom properties on `:root` in `styles.css`.
```

- [ ] **Step 8.4: Verify locally one last time**

Full end-to-end walkthrough:
1. Fresh browser window, `preview_start` if needed.
2. Confirm console: `[omikuji-garden] ready — 14 fortunes, 10 articles`.
3. Draw 3 times. Flip each. Read each. Return.
4. Check `preview_network` for any 404s on fonts or data files.
5. `preview_screenshot` of final signbox scene for the user's reference.

- [ ] **Step 8.5: Commit + push-readiness**

```bash
git add . && git commit -m "feat: add GitHub Pages deployment workflow and README"
```

Do NOT `git push` or `gh repo create` autonomously — that's a shared-state action the user must authorize.

- [ ] **Step 8.6: Ruthless-mentor review gate**

Reviewer criteria:
- Workflow YAML valid (correct `actions/*` versions, permissions block correct)?
- No hardcoded `BXya` / user-specific paths in workflow (should work for anyone who forks)?
- README instructions reproducible by someone reading cold?
- Final visual matches PLAN.md §6?
- Total article count exactly 10; total fortune count exactly 14?
- Verdict: PASS / FAIL.

---

## Accepted Deviations from PLAN.md

Document these deliberate simplifications so the final alignment check doesn't flag them as bugs:

- **Persistent ⛩ icon in top-left** (PLAN §4) — **omitted per YAGNI.** Each stage (stick, overlay) already has explicit "回签筒 / Return" buttons. A third always-visible icon would duplicate the same action and clutter the minimalist scene. If the user wants it post-v1, it's a 10-line addition.
- **Unused `levelRomaji` field in fortunes.json** — retained as static metadata for debug/future i18n, not read at runtime. Not a bug.
- **Article migration fidelity** (Slice 6) — if a midterm article contains markdown features outside the supported subset (links, images, code), those features degrade to literal text per PLAN §5. Not a silent loss: visible in the overlay.

## Final Alignment Check

After Slice 8 passes its gate, run one last end-to-end comparison against PLAN.md:

- [ ] **Final Step: Open `PLAN.md` and the built site side-by-side.** Walk sections §1 (concept) → §12 (risks). For each section, confirm the site satisfies it or that the deviation is documented in the "Accepted Deviations" section above. Report any unsatisfied and undocumented items to the user.

- [ ] **Final commit:**

```bash
git add . && git commit -m "chore: omikuji-garden v1 — all slices complete, aligned to spec" || true
```

- [ ] **Final summary to user:** Report what was built, any deviations from PLAN.md with rationale, and the exact command the user runs to push + deploy (`gh repo create omikuji-garden --public --source=. --push`).
