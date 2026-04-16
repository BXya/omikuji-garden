// omikuji-garden — draw + stick-face logic.
// NOTE: `<script type="module">` is deferred, so DOM is already parsed
// by the time init() runs. Later slices can assume document.body exists.
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
    document.body.dataset.omikujiState = "ready";
    console.log(`[omikuji-garden] ready — ${fortunes.length} fortunes, ${articles.length} articles`);
    window.__omikuji = state; // dev inspection handle
  } catch (err) {
    document.body.dataset.omikujiState = "error";
    console.error("[omikuji-garden] init failed:", err);
  }
}

init();
