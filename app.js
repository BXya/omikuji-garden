// omikuji-garden — draw + stick-face logic.
// NOTE: `<script type="module">` is deferred, so DOM is already parsed
// by the time init() runs. Later slices can assume document.body exists.
// Article overlay lands in Slice 5.

const DATA_PATHS = {
  fortunes: "data/fortunes.json",
  articles: "data/articles.json",
};

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
    if (line.startsWith("&gt; ")) { flushPara(); quote.push(line.slice(5)); continue; }
    flushQuote();
    para.push(line);
  }
  flushPara();
  flushQuote();
  return out.join("\n");
}

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

/** Weighted random pick of one article. Article weights default to 1.
 *  Canonical formulation: accumulate weights, find first prefix that exceeds r.
 *  Returns the last article as a safety fallback (unreachable with non-negative weights). */
function pickArticle(articles) {
  const total = articles.reduce((s, a) => s + (a.weight ?? 1), 0);
  if (total <= 0) return articles[Math.floor(Math.random() * articles.length)];
  const r = Math.random() * total;
  let acc = 0;
  for (const a of articles) {
    acc += (a.weight ?? 1);
    if (r < acc) return a;
  }
  return articles[articles.length - 1];
}

function setStage(stage) {
  document.getElementById("app").dataset.stage = stage;
}

function renderStickFront(fortune) {
  document.getElementById("fortune-seal").textContent = fortune.level;
  document.getElementById("fortune-seal").setAttribute("aria-label", `運勢: ${fortune.level}`);
  document.getElementById("fortune-text-ja").textContent = fortune.text_ja;
  document.getElementById("fortune-text-zh").textContent = fortune.text_zh;
  document.getElementById("stick-number").textContent = `第 ${fortune.id} 番`;
}

function draw() {
  if (!state.fortunes.length) return; // guard: data not yet loaded
  state.currentFortune = pickFortune(state.fortunes);
  state.currentArticle = pickArticle(state.articles);
  renderStickFront(state.currentFortune);

  const stage = document.getElementById("stick-stage");
  stage.hidden = false;
  setStage("stick");

  // Force-restart the slide-up animation: clear the attr, flush layout, re-add.
  delete stage.dataset.anim;
  // eslint-disable-next-line no-unused-expressions
  stage.offsetWidth; // reflow — reads layout to commit the attribute removal
  stage.dataset.anim = "entering";

  // Clean up the attribute after animation so next restart works identically.
  stage.addEventListener("animationend", () => {
    delete stage.dataset.anim;
  }, { once: true });

  // Move keyboard focus to the next action for accessibility.
  document.getElementById("btn-flip").focus();
}

function returnToSignbox() {
  const stage = document.getElementById("stick-stage");
  stage.hidden = true;
  delete stage.dataset.anim;
  setStage("signbox");
  state.currentFortune = null;
  state.currentArticle = null;
  document.getElementById("signbox").focus();
}

function openArticle(article) {
  const titleEl = document.getElementById("overlay-title");
  const titleEnEl = document.getElementById("overlay-title-en");
  const bodyEl = document.getElementById("overlay-body");
  // Fallback if an article somehow has no title — keeps the dialog labelable.
  titleEl.textContent = article.title || "無題 · Untitled";
  titleEnEl.textContent = article.titleEn || "";
  bodyEl.innerHTML = renderMarkdown(article.body || "");
  const overlay = document.getElementById("overlay");
  overlay.hidden = false;
  overlay.scrollTop = 0;
  // Move focus into the overlay for keyboard navigation
  document.getElementById("btn-redraw-from-article").focus();
}

function closeArticle() {
  document.getElementById("overlay").hidden = true;
  // Return focus to the Flip button (logical back-target). It's still in
  // the DOM while the stick stage is visible.
  const flip = document.getElementById("btn-flip");
  if (flip && !flip.closest("[hidden]")) flip.focus();
}

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

  // TODO(slice-7): trap focus inside overlay via `inert` on sibling elements.
  // Esc closes the article overlay — standard dialog expectation.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const overlay = document.getElementById("overlay");
      if (overlay && !overlay.hidden) closeArticle();
    }
  });
}

async function init() {
  try {
    const { fortunes, articles } = await loadData();
    state.fortunes = fortunes;
    state.articles = articles;
    wireEvents();
    setStage("signbox");
    document.body.dataset.omikujiState = "ready";
    console.log(`[omikuji-garden] ready — ${fortunes.length} fortunes, ${articles.length} articles`);
    window.__omikuji = state; // dev inspection handle
  } catch (err) {
    document.body.dataset.omikujiState = "error";
    console.error("[omikuji-garden] init failed:", err);
  }
}

init();
